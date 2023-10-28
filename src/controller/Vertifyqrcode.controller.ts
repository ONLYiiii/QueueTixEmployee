import { verifyTicket, exitTicket } from "../database/VetifyQrcode";

interface resultType {
    _id?: string;
    type?: string;
    timeCheckin?: Date;
    priceType?: string;
    status: string;
}

export async function CheckTicketID(email: string, _id: string, dateofuse: string, mode: string) {
    const result: resultType = mode === "IN" ? await verifyTicket(email, _id, dateofuse) : await exitTicket(email, _id, dateofuse); //ถ้าสำเร็จจะ return json object ถ้าล้มเหลว return string
    console.log(result);
    return result;
}
