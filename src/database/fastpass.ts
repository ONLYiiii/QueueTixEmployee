import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";

export async function updateFastpassIsUsed(
    idpurchaseFastpassOfRides: string,
    rideId: string
): Promise<{ timeCheckin?: Date; startRound?: Date; endRound?: Date; status: string }> {
    try {
        const findSql = (await connection).format(
            `SELECT pf._id, pf.isUsed, pf.start_datetime, pf.end_datetime, pf.updated_at
            FROM purchasefastpassofrides pfr
            JOIN purchaseticketfastpass pf
                ON pfr.id_purchaseticketfastpass = pf._id
            JOIN user u
                ON pf.id_user = u._id
            WHERE pfr._id = ? AND pfr.id_rides = ?;`,
            [idpurchaseFastpassOfRides, rideId]
        );
        const [fastpassRows] = await (await connection).execute<RowDataPacket[]>(findSql);

        //?--------------------No_Ticket--------------------
        if (fastpassRows.length === 0) {
            return { status: "no fastpass" };
        }
        //?-------------------------------------------------
        else {
            //?--------------------Used--------------------
            const fastpass = fastpassRows[0] as { _id: string; isUsed: number; start_datetime: string; end_datetime: string; updated_at: string };
            if (fastpass.isUsed !== 0) {
                return { timeCheckin: new Date(fastpass.updated_at), status: "used" };
            }
            //?--------------------------------------------

            //?--------------------Check_Time_Prepare--------------------
            const nowTime: Date = new Date();
            const startTime: Date = new Date(fastpass.start_datetime);
            const diffTime: number = (startTime.getTime() - nowTime.getTime()) / 1000;
            //?----------------------------------------------------------

            //?--------------------Not_This_Time--------------------
            if (diffTime >= 600) {
                return { startRound: new Date(fastpass.start_datetime), endRound: new Date(fastpass.end_datetime), status: "not this time" };
            }
            //?-----------------------------------------------------

            //?--------------------Expired--------------------
            if (diffTime <= 0) {
                return { startRound: new Date(fastpass.start_datetime), endRound: new Date(fastpass.end_datetime), status: "expired" };
            }
            //?-----------------------------------------------

            //?--------------------Success--------------------
            const updateSql = (await connection).format(`UPDATE purchaseticketfastpass SET isUsed = 1, updated_at = ? WHERE _id = ?`, [
                nowTime,
                fastpass._id,
            ]);
            await (await connection).execute(updateSql);
            return { timeCheckin: nowTime, status: "success" };
            //?-----------------------------------------------
        }
    } catch (error) {
        console.log("Error Found In findIdPurchaseticketfastpass: " + error);
        return { status: "error" };
    }
}

export async function findFastpassDetails(id_purchasefastpassofrides: string) {
    try {
        const sql = (await connection).format(
            `SELECT r.name_rides_thai, ptf.start_datetime, ptf.end_datetime,
                ptf.isUsed, ptf.updated_at FROM purchasefastpassofrides pfr
            JOIN purchaseticketfastpass ptf
                ON pfr.id_purchaseticketfastpass = ptf._id
            JOIN rides r
                ON pfr.id_rides = r._id
            WHERE pfr._id = ?;`,
            [id_purchasefastpassofrides]
        );
        const [fastpassRows] = await (await connection).execute<RowDataPacket[]>(sql);
        if (fastpassRows.length !== 0) {
            return { ...fastpassRows[0], status: "success" } as {
                rideName: string;
                start_datetime: Date;
                end_datetime: Date;
                isUsed: number;
                updated_at: Date;
                status: string;
            };
        } else {
            return { status: "No Ticket" };
        }
    } catch (error) {
        console.log("Error Found In fastpassDetails: " + error);
        return { status: "error" };
    }
}
