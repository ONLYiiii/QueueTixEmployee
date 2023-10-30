import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";
import { getFullDate } from "../service/dateFormat";

interface ticketDetailsType {
    ticketId: string;
    date_of_use: Date;
    email: string;
    type: string;
    priceType: string;
    checkinId: number;
    entrance_status: number;
    updated_at: Date;
}

export async function verifyTicket(email: string, _id: string, dateofuse: string) {
    try {
        //?--------------------SQL_Command--------------------
        const sql = (await connection).format(
            `SELECT ptt._id AS ticketId, pt.date_of_use, u.email, t.title AS type, ptt.types AS priceType,
                tfe._id AS checkinId, tfe.entrance_status, tfe.updated_at
            FROM purchasetickettypes ptt
            LEFT JOIN ticketforentrance tfe
                ON ptt._id = tfe.id_purchasetickettypes
            JOIN purchaseticket pt
                ON ptt.id_purchaseticket = pt._id
            JOIN user u
                ON pt.id_user = u._id
            JOIN ticket t
                ON pt.id_ticket = t._id
            WHERE ptt._id = ?  AND u.email = ? AND pt.date_of_use = ?;`,
            [_id, email, new Date(dateofuse)]
        );
        const [Resultis_Active] = await (await connection).execute<RowDataPacket[]>(sql); //รันโค้ดsqlที่เขียนไว้บรรทัดบน
        //?---------------------------------------------------

        //?--------------------No_Ticket--------------------
        if (Resultis_Active.length === 0) {
            return { status: "no ticket" };
        }
        //?-------------------------------------------------

        //?--------------------Prepare_Data--------------------
        const ticketDetails = Resultis_Active[0] as ticketDetailsType;
        const today = getFullDate(new Date());
        const returnData = {
            _id: Resultis_Active[0]._id,
            type: Resultis_Active[0].type,
            priceType: Resultis_Active[0].priceType,
        };
        //?----------------------------------------------------

        //?--------------------Not_Today--------------------
        if (getFullDate(ticketDetails.date_of_use) !== today) {
            return {
                ...returnData,
                timeCheckin: ticketDetails.date_of_use,
                status: "not this date",
            };
        }
        //?-------------------------------------------------

        //?--------------------Success--------------------
        else if (ticketDetails.checkinId === null) {
            const checkinTime = await insertEntranceStatus(ticketDetails.ticketId);
            return {
                ...returnData,
                timeCheckin: checkinTime,
                status: "success",
            };
        }
        //?-----------------------------------------------

        //?--------------------Not_Success--------------------
        else if (ticketDetails.checkinId !== null) {
            switch (ticketDetails.entrance_status) {
                case 0: //? Already Used
                    return {
                        ...returnData,
                        timeCheckin: ticketDetails.updated_at,
                        status: "used",
                    };
                case 1: //? Already Exit
                    return {
                        ...returnData,
                        timeCheckin: ticketDetails.updated_at,
                        status: "exit",
                    };
                case 2: //? Already Expired
                    return {
                        ...returnData,
                        timeCheckin: ticketDetails.date_of_use,
                        status: "expired",
                    };
                default:
                    return { status: "error" };
            }
        }
        //?---------------------------------------------------

        //?--------------------Error--------------------
        else {
            return { status: "error" };
        }
        //?---------------------------------------------
    } catch (error) {
        console.log(error);
        return { status: "error" };
    }
}

export async function exitTicket(email: string, _id: string, dateofuse: string) {
    try {
        //?--------------------SQL_Command--------------------
        const sql = (await connection).format(
            `SELECT ptt._id AS ticketId, pt.date_of_use, u.email, t.title AS type, ptt.types AS priceType,
                tfe._id AS checkinId, tfe.entrance_status, tfe.updated_at
            FROM purchasetickettypes ptt
            LEFT JOIN ticketforentrance tfe
                ON ptt._id = tfe.id_purchasetickettypes
            JOIN purchaseticket pt
                ON ptt.id_purchaseticket = pt._id
            JOIN user u
                ON pt.id_user = u._id
            JOIN ticket t
                ON pt.id_ticket = t._id
            WHERE ptt._id = ?  AND u.email = ? AND pt.date_of_use = ?;`,
            [_id, email, new Date(dateofuse)]
        );
        const [Resultis_Active] = await (await connection).execute<RowDataPacket[]>(sql); //รันโค้ดsqlที่เขียนไว้บรรทัดบน
        //?---------------------------------------------------

        //?--------------------No_Ticket--------------------
        if (Resultis_Active.length === 0) {
            return { status: "no ticket" };
        }
        //?-------------------------------------------------

        //?--------------------Prepare_Data--------------------
        const ticketDetails = Resultis_Active[0] as ticketDetailsType;
        const today = getFullDate(new Date());
        const returnData = {
            _id: Resultis_Active[0]._id,
            type: Resultis_Active[0].type,
            priceType: Resultis_Active[0].priceType,
        };
        //?----------------------------------------------------

        //?--------------------Not_Today--------------------
        if (getFullDate(ticketDetails.date_of_use) !== today) {
            return {
                ...returnData,
                timeCheckin: ticketDetails.date_of_use,
                status: "not this date",
            };
        }
        //?-------------------------------------------------

        //?--------------------Not_Used--------------------
        else if (ticketDetails.checkinId === null) {
            return {
                ...returnData,
                timeCheckin: ticketDetails.updated_at,
                status: "not used",
            };
        }
        //?------------------------------------------------

        //?--------------------Has_checkinId--------------------
        else if (ticketDetails.checkinId !== null) {
            switch (ticketDetails.entrance_status) {
                case 0: //? Success
                    const nowTime = await updateEntranceStatus(ticketDetails.ticketId);
                    return {
                        ...returnData,
                        timeCheckin: nowTime,
                        status: "success",
                    };
                case 1: //? Already Exit
                    return {
                        ...returnData,
                        timeCheckin: ticketDetails.updated_at,
                        status: "exit",
                    };
                case 2: //? Already Expired
                    return {
                        ...returnData,
                        timeCheckin: ticketDetails.date_of_use,
                        status: "expired",
                    };
                default:
                    return { status: "error" };
            }
        }
        //?-----------------------------------------------------

        //?--------------------Error--------------------
        else {
            return { status: "error" };
        }
        //?---------------------------------------------
    } catch (error) {
        console.log(error);
        return { status: "error" };
    }
}

async function insertEntranceStatus(ticketId: string) {
    try {
        const nowTime = new Date();
        const sql = (await connection).format(`INSERT INTO ticketforentrance VALUE (DEFAULT, 0, ?, ?, ?);`, [nowTime, nowTime, ticketId]);
        await (await connection).execute<RowDataPacket[]>(sql);
        return nowTime;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function updateEntranceStatus(ticketId: string) {
    try {
        const nowTime = new Date();
        const sql = (await connection).format(`UPDATE ticketforentrance SET entrance_status = 1, updated_at = ? WHERE id_purchasetickettypes = ?;`, [
            nowTime,
            ticketId,
        ]);
        await (await connection).execute<RowDataPacket[]>(sql);
        return nowTime;
    } catch (error) {
        console.log(error);
        return false;
    }
}
