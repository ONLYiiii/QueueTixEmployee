import getURL from "../getURL";
import { Ticket } from "../../interface/ticket";

export default async function ticketList(): Promise<Ticket[]> {
    const response = await fetch(getURL() + "send_TicketList/");
    const data: Ticket[] = await response.json();
    return data;
}
