import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";

export async function writeTimeCheck({ _id, id_rides }: { _id: string; id_rides: string }) {
    try {
        const sql = (await connection).format(
            `INSERT INTO datetimecheckinrides (_id, id_employee, id_rides,time_in)
    VALUES (DEFAULT, ?, ?, ?);`,
            [_id, id_rides, new Date()]
        );
        await (await connection).execute<RowDataPacket[]>(sql);
        return "Write File_data Success";
    } catch (error) {
        console.log(error);
        return "Write File_data Fail";
    }
}
