import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Express, Request, Response } from "express";
import { qrcodeGenerate } from "./controller/Genqrcode.controller";
import { testConnectDb } from "./configs/database";
import { findPurchaseTicketID, findTicketDetails } from "./database/purchaseTicket";
import { CheckTicketID } from "./controller/Vertifyqrcode.controller";
import { Find_AccountEmployee, Find_RoleEmployee, Find_AccountPicture } from "./database/employee";
import { writeTimeCheck } from "./controller/WriteTimecheck";
import { InputPassword } from "./controller/InputNewPassword";
import getSecretKey from "./service/getSecretKey";

//? Routes
import ridesRoute from "./routes/ridesRoute";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/rides", ridesRoute);

app.post("/verifyJwt", (req: Request, res: Response) => {
    try {
        const token: string = req.headers.authorization as string;
        const decoded: { sub: string } = jwt.verify(token, getSecretKey()) as { sub: string };
        res.status(200);
        res.end();
    } catch (error) {
        console.log("Error Found In verifyJwt: " + error);
        res.status(401);
        res.end();
    }
});

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
        const token = jwt.sign({ sub: dataEmployee._id }, getSecretKey());
        if (input.password === "12345678") {
            writeTimeCheck(dataEmployee);
            res.send({ token: token, fullname: dataEmployee.fullname, message: "Change Password Require" });
            res.end();
        } else {
            writeTimeCheck(dataEmployee);
            res.send({ token: token, fullname: dataEmployee.fullname, message: "Login successful" });
            res.end();
        }
    } else {
        res.status(401).send("Login Fail");
        res.end();
    }
});

app.get("/accountRole", async (req: Request, res: Response) => {
    try {
        const token: string = req.headers.authorization as string;
        const decoded: { sub: string } = jwt.verify(token, getSecretKey()) as { sub: string };
        const types: string | false = await Find_RoleEmployee(decoded.sub);
        if (!types) {
            res.status(401);
            res.end();
        } else {
            res.send(types);
            res.end();
        }
    } catch (error) {
        console.log("Error Found In /accountRole: " + error);
        res.status(400);
        res.end();
    }
});

app.get("/profilepic", async (req: Request, res: Response) => {
    try {
        const token: string = req.headers.authorization as string;
        console.log(token ? token : "No Token");
        const decoded: { sub: string } = jwt.verify(token, getSecretKey()) as { sub: string };
        const picUser = await Find_AccountPicture(decoded.sub);
        if (!picUser) {
            res.status(401);
            res.end();
        } else {
            res.send(picUser);
            res.end();
        }
    } catch (error) {
        console.log("Error Found In /profilepic: " + error);
        res.status(400);
        res.end();
    }
});

app.post("/changePassword", async (req: Request, res: Response) => {
    try {
        const password: string = req.body.password;
        const token: string = req.headers.authorization as string;
        const decoded: { sub: string } = jwt.verify(token, getSecretKey()) as { sub: string };
        bcrypt.hash(password, 12, (err, hash) => {
            if (err) {
                console.log(err);
                res.end();
                return;
            }
            InputPassword(hash, decoded.sub).then((result) => {
                if (result) {
                    res.status(200);
                    res.end();
                } else {
                    res.status(401);
                    res.end();
                }
            });
        });
    } catch (error) {
        console.log("Error Found In /changePassword: " + error);
        res.status(400);
        res.end();
    }
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
    console.log(req.body.data);
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
            res.send(ticketDetails);
            res.end();
        }
    });
});

app.listen(4000, () => {
    //สร้างserver
    console.log("listening on port http://localhost:4000");
    testConnectDb();
});
