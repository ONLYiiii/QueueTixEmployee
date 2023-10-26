import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";

export async function Find_AccountEmployee(email: string) {
    const sql = (await connection).format(
        `SELECT _id, email, password,id_rides,profilePicture FROM employee WHERE email = ?;`,
        [email]
    );
    const [result_AccountEmployee] = await (await connection).execute<RowDataPacket[]>(sql);
    if (result_AccountEmployee.length === 0) {
        return "Not Found";
    } else {
        return result_AccountEmployee[0] as {
            _id: string;
            email: string;
            password: string;
            id_rides: string;
            profilePicture: string;
        };
    }
}

export async function Find_RoleEmployee(email: string) {
    const sql = (await connection).format(`SELECT id_rides,types FROM employee WHERE email = ?;`, [email]);
    const [result_Role] = await (await connection).execute<RowDataPacket[]>(sql);
    if (result_Role[0].types === "EntranceEmployee") {
        return "พนักงานตรวจสอบบัตรผ่านประตู";
    } else {
        const sql2 = (await connection).format(`SELECT name_rides_thai FROM rides WHERE _id = ?`, [
            result_Role[0].id_rides,
        ]);
        const [rideName] = await (await connection).execute<RowDataPacket[]>(sql2);
        return rideName[0].name_rides_thai as string;
    }
}
