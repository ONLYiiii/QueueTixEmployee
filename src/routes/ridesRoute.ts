import express from "express";
import jwt from "jsonwebtoken";
import type { Router, Request, Response } from "express";

//? Database
import { checkStatusTicket, findEmployeeRideId, updateUsedCount, updateStatusTicket } from "../database/rides";

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
        const tickettype: string | { engName: string; thaiName: string; priceType: string } = await checkStatusTicket(
            user_email,
            purchaseoftypesId,
            dateofuse
        );
        console.log(tickettype);
        if (typeof tickettype === "string") {
            res.status(400).send({ status: tickettype });
            res.end();
            return;
        }
        const decoded: { sub: string } = jwt.verify(token, getSecretKey()) as { sub: string };
        const rideDetails = await findEmployeeRideId(decoded.sub);
        if (!rideDetails) {
            res.status(400).send({ status: "error" });
            res.end();
        } else {
            const nowTime = new Date();
            const updateResult = await updateUsedCount(purchaseoftypesId, rideDetails.rideId, tickettype.engName, nowTime);
            if (updateResult !== "success") {
                res.status(400).send({ status: updateResult });
                res.end();
            } else {
                const changeStatusResult = await updateStatusTicket(purchaseoftypesId, tickettype.engName, nowTime);
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

export default router;
