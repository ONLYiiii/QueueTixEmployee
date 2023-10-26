import { findPurchaseTicketID } from "../database/purchaseTicket";
import { verifyTicket } from "../database/VetifyQrcode";
import { writeTicketList } from "../service/writeJson";

interface resultType {
    _id?: string;
    type?: string;
    updated_at?: Date;
    priceType?: string;
    status: string;
}

export async function CheckTicketID(email: string, _id: string, dateofuse: string) {
    const result: resultType = await verifyTicket(email, _id, dateofuse); //ถ้าสำเร็จจะ return json object ถ้าล้มเหลว return string
    if (result.status === "success") {
        writeTicketList(_id);
    }
    return result;
}
