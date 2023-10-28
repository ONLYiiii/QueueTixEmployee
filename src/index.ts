import express from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import type { Express, Request, Response } from "express";
import type Ticket from "./types/ticket";
import { qrcodeGenerate } from "./controller/Genqrcode.controller";
import { testConnectDb } from "./configs/database";
import { findPurchaseTicketID, findTicketDetails } from "./database/purchaseTicket";
import { CheckTicketID } from "./controller/Vertifyqrcode.controller";
import { getFullDate } from "./service/dateFormat";
import { Find_AccountEmployee } from "./database/employee";
import { writeTimeCheck } from "./controller/WriteTimecheck";
import { InputPassword } from "./controller/InputNewPassword";
import { Find_RoleEmployee } from "./database/employee";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", async (req: Request, res: Response) => {
    const input: { email: string; password: string } = req.body;
    const dataEmployee = await Find_AccountEmployee(input.email);
    if (dataEmployee === "Not Found") {
        res.status(401).send("Not Found");
        res.end();
        return;
    }
    const result = await bcrypt.compare(input.password, dataEmployee.password);
    if (result) {
        if (input.password === "12345678") {
            writeTimeCheck(dataEmployee);
            res.send("Change Password Require");
            res.end();
        } else {
            writeTimeCheck(dataEmployee);
            res.send("Login successful");
            res.end();
        }
    } else {
        res.status(401).send("Login Fail");
        res.end();
    }
});

app.get("/accountRole", async (req: Request, res: Response) => {
    const email: string = req.query.email as string;
    const types: string = await Find_RoleEmployee(email);
    console.log(types);
    res.send(types);
    res.end();
});

app.get("/profilepic", async (req: Request, res: Response) => {
    const email: string = req.query.email as string;
    const DataUser = await Find_AccountEmployee(email);
    if (typeof DataUser === "object") {
        res.send(DataUser.profilePicture);
        res.end();
    }
});

app.post("/changePassword", async (req: Request, res: Response) => {
    const password: string = req.body.password;
    const email: string = req.body.email;
    bcrypt.hash(password, 12, (err, hash) => {
        if (err) {
            console.log(err);
            res.end();
            return;
        }
        InputPassword(hash, email).then((result) => {
            if (result) {
                res.status(200);
                res.end();
            } else {
                res.status(401);
                res.end();
            }
        });
    });
});

app.get("/views", (req: Request, res: Response) => {
    res.sendFile(__dirname + "\\views\\QrcodeList.html");
});

app.post("/generate_qrcode", (req: Request, res: Response) => {
    const data: string = req.body.data;
    findPurchaseTicketID(data).then((result_IdTicket: string | false) => {
        if (result_IdTicket === false) {
            res.status(404);
            res.end();
        } else {
            qrcodeGenerate(result_IdTicket).then((qrcodeImg) => {
                res.send(qrcodeImg);
                res.end();
            });
        }
    });
});
app.post("/qrcode/verify", (req: Request, res: Response) => {
    const mode = req.body.mode;
    const email = req.body.data.user_email;
    const id = req.body.data.purchaseoftypesId;
    const dateofuse = req.body.data.dateofuse;
    CheckTicketID(email, id, dateofuse, mode).then((result) => {
        if (result.status === "success") {
            res.status(200).send(result);
            res.end();
        } else {
            res.status(400).send(result);
            res.end();
        }
    });
});

app.get("/send_TicketDetail", (req: Request, res: Response) => {
    const data = JSON.parse(req.query.data as string);
    findTicketDetails(data.purchaseoftypesId, data.user_email, data.dateofuse).then((ticketDetails) => {
        if (!ticketDetails) {
            res.status(400);
            res.end();
        } else if (ticketDetails === "No Ticket") {
            res.status(404);
            res.end();
        } else {
            const sendData = { ...data, ...ticketDetails };
            res.send(sendData);
            res.end();
        }
    });
});

app.listen(4000, () => {
    //สร้างserver
    console.log("listening on port http://localhost:4000");
    testConnectDb();
});
