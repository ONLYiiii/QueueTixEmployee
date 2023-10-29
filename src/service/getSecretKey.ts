import fs from "fs";
import path from "path";
import { getFullDate } from "./dateFormat";

function randomString(length: number) {
    let result: string = "";
    const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default function getSecretKey(): string {
    const filePath: string = path.join(__dirname, "..\\model\\secretKey.json");
    const dataString: string = fs.readFileSync(filePath, "utf8");
    const secretKeyData: { date: string; key: string } = dataString === "" ? { date: "", key: "" } : JSON.parse(dataString);
    if (secretKeyData.date !== getFullDate(new Date())) {
        secretKeyData.date = getFullDate(new Date());
        secretKeyData.key = randomString(12);
        fs.writeFileSync(filePath, JSON.stringify(secretKeyData), "utf-8");
    }
    return secretKeyData.key;
}
