import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";

export async function updateFastpassIsUsed(
    email: string,
    idpurchaseFastpassOfRides: string,
    rideId: string
): Promise<{ timeCheckin?: Date; status: string }> {
    try {
        const findSql = (await connection).format(
            `SELECT pf._id, pf.isUsed, pf.start_datetime
            FROM purchasefastpassofrides pfr
            JOIN purchaseticketfastpass pf
                ON pfr.id_purchaseticketfastpass = pf._id
            JOIN user u
                ON pf.id_user = u._id
            WHERE pfr._id = ? AND pfr.id_rides = ?  AND u.email = ?;`,
            [idpurchaseFastpassOfRides, rideId, email]
        );
        const [fastpassRows] = await (await connection).execute<RowDataPacket[]>(findSql);

        //?--------------------No_Ticket--------------------
        if (fastpassRows.length === 0) {
            return { status: "no fastpass" };
        }
        //?-------------------------------------------------
        else {
            //?--------------------Used--------------------
            const fastpass = fastpassRows[0] as { _id: string; isUsed: number; start_datetime: string };
            if (fastpass.isUsed !== 0) {
                return { status: "used" };
            }
            //?--------------------------------------------

            //?--------------------Check_Time_Prepare--------------------
            const nowTime: Date = new Date();
            const startTime: Date = new Date(fastpass.start_datetime);
            const diffTime: number = (startTime.getTime() - nowTime.getTime()) / 1000;
            //?----------------------------------------------------------

            //?--------------------Not_This_Time--------------------
            if (diffTime >= 600) {
                return { status: "not this time" };
            }
            //?-----------------------------------------------------

            //?--------------------Expired--------------------
            if (diffTime <= 0) {
                return { status: "expired" };
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
