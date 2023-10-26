import fs from "fs";
import path from "path";
import { TicketList } from "../database/purchaseTicket";

export async function writeTicketList(_id: string) {
    try {
        const data = await TicketList(_id);
        const filePath: string = path.join(__dirname, "../model/ticketlist.json");

        const jsonString = fs.readFileSync(filePath, "utf8");
        const TicketData = JSON.parse(jsonString);

        TicketData.push(data);
        fs.writeFileSync(filePath, JSON.stringify(TicketData), "utf8");
        return true;
    } catch (error) {
        console.log("Error Wrte TicketList on JsonFile: " + error);
        return false;
    }
}

//__dirname = "C:\ProjectQueueTix\newQueueTixServer\src\service"
// string concat = "C:\ProjectQueueTix\newQueueTixServer\src\service\..\model\ticketlist.json"
// path.join = "C:\ProjectQueueTix\newQueueTixServer\src\model\ticketlist.json"
