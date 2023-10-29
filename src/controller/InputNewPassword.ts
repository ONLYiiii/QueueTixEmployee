import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";

export async function InputPassword(hash: string, _id: string) {
    try {
        const sql = (await connection).format(`UPDATE employee SET password = ? WHERE _id = ?`, [hash, _id]);
        await (await connection).execute<RowDataPacket[]>(sql);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
