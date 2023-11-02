import express from "express";
import jwt from "jsonwebtoken";
import type { Router, Request, Response } from "express";

//? Database
import { checkStatusTicket, findEmployeeRideId, updateUsedCount, updateStatusTicket, updateRoundRides } from "../database/rides";
import { updateFastpassIsUsed, findFastpassDetails } from "../database/fastpass";

//? Service
import getSecretKey from "../service/getSecretKey";

const router: Router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//* Route "/rides"
router.post("/", async (req: Request, res: Response) => {
    const { user_email, purchaseoftypesId, dateofuse } = req.body;
    try {
        const token: string = req.headers.authorization as string;
        const decoded: { sub: string } = jwt.verify(token, getSecretKey()) as { sub: string };
        const rideDetails = await findEmployeeRideId(decoded.sub);
        if (!rideDetails) {
            res.status(400).send({ status: "error" });
            res.end();
        } else {
            const tickettype: string | { engName: string; thaiName: string; priceType: string; cooldown?: number; status: string } =
                await checkStatusTicket(user_email, purchaseoftypesId, dateofuse);
            console.log(tickettype);
            if (typeof tickettype === "string") {
                res.status(400).send({ status: tickettype });
                res.end();
                return;
            } else if (tickettype.status === "not used" || tickettype.status === "no more rides to play") {
                res.status(400).send({
                    rideName: rideDetails.rideName,
                    ticketType: tickettype.thaiName,
                    priceType: tickettype.priceType,
                    status: tickettype.status,
                });
                res.end();
                return;
            } else if (tickettype.status === "cooldown") {
                res.status(400).send({
                    rideName: rideDetails.rideName,
                    ticketType: tickettype.thaiName,
                    priceType: tickettype.priceType,
                    cooldown: tickettype.cooldown,
                    status: tickettype.status,
                });
                res.end();
                return;
            }
            const nowTime = new Date();
            const updateResult = await updateUsedCount(purchaseoftypesId, rideDetails.rideId, tickettype.engName, nowTime);
            if (updateResult !== "success") {
                if (updateResult === "limit") {
                    res.status(400).send({
                        rideName: rideDetails.rideName,
                        ticketType: tickettype.thaiName,
                        priceType: tickettype.priceType,
                        status: updateResult,
                    });
                    res.end();
                } else {
                    res.status(400).send({ status: updateResult });
                    res.end();
                }
            } else {
                const changeStatusResult = await updateStatusTicket(purchaseoftypesId, tickettype.engName, nowTime);
                await updateRoundRides(rideDetails.rideId);
                if (changeStatusResult) {
                    res.send({
                        rideName: rideDetails.rideName,
                        ticketType: tickettype.thaiName,
                        priceType: tickettype.priceType,
                        timeCheckin: nowTime,
                        status: "success",
                    });
                    res.end();
                } else {
                    res.status(400).send({ status: "error" });
                    res.end();
                }
            }
        }
    } catch (error) {
        console.log("Error Found In /rides: " + error);
        res.status(400).send({ status: "error" });
        res.end();
    }
});

//* Route "/rides/fastpass"
router.post("/fastpass", async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        const token: string = req.headers.authorization as string;
        const decoded: { sub: string } = jwt.verify(token, getSecretKey()) as { sub: string };
        const rideDetails = await findEmployeeRideId(decoded.sub);
        if (!rideDetails) {
            res.status(400).send({ status: "error" });
            res.end();
        } else {
            const updateResult: { timeCheckin?: Date; startRound?: Date; endRound?: Date; status: string } = await updateFastpassIsUsed(
                id,
                rideDetails.rideId
            );
            if (updateResult.status !== "success") {
                res.status(400).send({ ...updateResult, rideName: rideDetails.rideName });
                res.end();
            } else {
                res.send({ ...updateResult, rideName: rideDetails.rideName });
                res.end();
            }
        }
    } catch (error) {
        console.log("Error Found In /fastpass: " + error);
        res.status(400).send({ status: "error" });
        res.end();
    }
});

//* Route "/rides/fastpass/details"
router.get("/fastpass/details", (req: Request, res: Response) => {
    const data = JSON.parse(req.query.data as string);
    findFastpassDetails(data.id).then((fastpassDetails) => {
        if (fastpassDetails.status === "error") {
            res.status(400);
            res.end();
        } else if (fastpassDetails.status === "No Ticket") {
            res.status(404);
            res.end();
        } else {
            res.send(fastpassDetails);
            res.end();
        }
    });
});

export default router;
