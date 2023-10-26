import qrcode from "qrcode";
import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";

export async function qrcodeGenerate(_id: string): Promise<string> {
    try {
        const sql = (await connection).format(
            `SELECT ptt._id, u.email, pt.date_of_use FROM purchasetickettypes ptt
            JOIN purchaseticket pt
                ON ptt.id_purchaseticket = pt._id
            JOIN user u
                ON pt.id_user = u._id
            WHERE ptt._id = ?;`,
            [_id]
        );
        const [resultData] = await (await connection).execute<RowDataPacket[]>(sql);
        const qrData = {
            user_email: resultData[0].email,
            purchaseoftypesId: resultData[0]._id,
            dateofuse: resultData[0].date_of_use,
        };
        const qrcodeImg: string = await qrcode.toDataURL(JSON.stringify(qrData));
        return qrcodeImg;
    } catch (error) {
        console.log(error);
        return "error";
    }
}
