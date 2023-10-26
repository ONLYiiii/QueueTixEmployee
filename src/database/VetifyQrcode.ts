import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";
import { getFullDate } from "../service/dateFormat";

interface resultsType {
    _id: string;
    type: string;
    updated_at: string;
    status_ticket: string;
    priceType: string;
    email: string;
    date_of_use: string;
    id_purchaseticket: string;
}

export async function verifyTicket(email: string, _id: string, dateofuse: string) {
    try {
        const sql = (await connection).format(
            `SELECT ptt._id, t.title AS type, ptt.updated_at, ptt.status_ticket,
                ptt.types AS priceType, u.email, pt.date_of_use, ptt.id_purchaseticket
            FROM purchaseticket pt
            JOIN ticket t
                ON pt.id_ticket = t._id
            JOIN purchasetickettypes ptt
                ON ptt.id_purchaseticket = pt._id
            JOIN user u
                ON pt.id_user = u._id
            WHERE ptt._id = ? AND u.email = ?  AND pt.date_of_use = ?;`,
            [_id, email, dateofuse]
        );
        console.log(sql);
        const [Resultis_Active] = await (await connection).execute<RowDataPacket[]>(sql); //รันโค้ดsqlที่เขียนไว้บรรทัดบน
        if (Resultis_Active.length === 0) {
            return { status: "no ticket" };
        } else {
            const today = getFullDate(new Date());
            if (getFullDate(Resultis_Active[0].date_of_use) !== today) {
                return {
                    _id: Resultis_Active[0]._id,
                    type: Resultis_Active[0].type,
                    priceType: Resultis_Active[0].priceType,
                    status: "not this date",
                };
            }
            if (Resultis_Active[0].status_ticket === 0) {
                const nowTime = await changeStatus(_id);
                if (nowTime) {
                    const resultData = Resultis_Active[0] as resultsType;
                    saveLogData(resultData, nowTime);
                    return {
                        _id: Resultis_Active[0]._id,
                        type: Resultis_Active[0].type,
                        priceType: Resultis_Active[0].priceType,
                        updated_at: nowTime,
                        status: "success",
                    };
                } else {
                    return { status: "error" };
                }
            } else {
                return {
                    _id: Resultis_Active[0]._id,
                    type: Resultis_Active[0].type,
                    priceType: Resultis_Active[0].priceType,
                    status: "used",
                };
            }
        }
    } catch (error) {
        console.log(error);
        return { status: "error" };
    }
}

export async function changeStatus(_id: string) {
    try {
        const nowTime = new Date();
        const sql = (await connection).format(
            `UPDATE purchasetickettypes SET status_ticket = 1, updated_at = ? WHERE _id = ?;`,
            [nowTime, _id]
        );
        await (await connection).execute<RowDataPacket[]>(sql);
        return nowTime;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function saveLogData(data: resultsType, nowTime: Date) {
    try {
        const history = (await connection).format(
            `INSERT INTO historyscanticket VALUE (
            DEFAULT, ?, ?, ?
        )`,
            [data.email, data._id, nowTime]
        );
        const entrance = (await connection).format(
            `INSERT INTO ticketforentrance VALUE(
                DEFAULT, ?, ?, ?, ?
            )`,
            [data.id_purchaseticket, 1, nowTime, nowTime]
        );
        await (await connection).execute(history);
        await (await connection).execute(entrance);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
