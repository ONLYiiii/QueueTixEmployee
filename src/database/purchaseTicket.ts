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
