import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";
import type Ticket from "../types/ticket";

export async function findPurchaseTicketID(idTicket: string) {
    try {
        const sql = (await connection).format(`SELECT _id FROM purchasetickettypes WHERE _id = ?;`, [idTicket]);
        const [result_IdTicket] = await (await connection).execute<RowDataPacket[]>(sql); //รันโค้ดsqlที่เขียนไว้บรรทัดบน
        return result_IdTicket[0]._id as string;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function findTicketDetails(_id: string, email: string, dateofuse: string) {
    try {
        const sql = (await connection).format(
            `SELECT ptt.status_ticket, ptt.types, pt.date_of_use, hst.time_check, t.title AS ticketTypes
            FROM purchaseticket pt
            JOIN ticket t
                ON pt.id_ticket = t._id
            JOIN purchasetickettypes ptt
                ON ptt.id_purchaseticket = pt._id
            LEFT JOIN historyscanticket hst
                ON ptt._id= hst.id_purchaseTicketTypes
            JOIN user u
                ON pt.id_user = u._id
            WHERE ptt._id = ? AND u.email = ? AND pt.date_of_use = ?`,
            [_id, email, new Date(dateofuse)]
        );
        console.log(sql);
        const [ticketRows] = await (await connection).execute<RowDataPacket[]>(sql);
        console.log(ticketRows);
        if (ticketRows.length !== 0) {
            return ticketRows[0];
        } else {
            return "No Ticket";
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function TicketList(idTicket: string) {
    try {
        const sql = (await connection).format(
            `SELECT pt._id, t.title AS type, u.email, pt.updated_at
        FROM purchaseticket pt
        JOIN user u
            ON pt.id_user = u._id
        JOIN ticket t
            ON pt.id_ticket = t._id
        WHERE pt._id = ?;`,
            [idTicket]
        );
        const [result_TicketList] = await (await connection).execute<RowDataPacket[]>(sql);

        return result_TicketList[0] as Ticket;
    } catch (error) {
        console.log(error);
        return "Can't find TicketList";
    }
}
