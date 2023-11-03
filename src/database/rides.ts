import type { RowDataPacket } from "mysql2";
import { connection } from "../configs/database";
import { getFullDate } from "../service/dateFormat";

export async function checkStatusTicket(
    email: string,
    _id: string,
    dateofuse: string
): Promise<
    | "not used"
    | "no more rides to play"
    | "error"
    | "no ticket"
    | { engName: string; thaiName: string; priceType: string; cooldown?: number; status: string }
> {
    try {
        const sql = (await connection).format(
            `SELECT pt.types, tfe.entrance_status, ptt.status_ticket, t.title AS ticketType, ptt.types AS priceType
            FROM purchasetickettypes ptt
            LEFT JOIN ticketforentrance tfe
                ON ptt._id = tfe.id_purchasetickettypes
            JOIN purchaseticket pt
                ON ptt.id_purchaseticket = pt._id
            JOIN user u
                ON pt.id_user = u._id
            JOIN ticket t
                ON pt.id_ticket = t._id
            WHERE ptt._id = ? AND u.email = ? AND pt.date_of_use = ?;`,
            [_id, email, getFullDate(new Date(dateofuse))]
        );
        const [ticketStatus] = await (await connection).execute<RowDataPacket[]>(sql);
        if (ticketStatus.length === 0) {
            return "no ticket";
        }
        if (ticketStatus[0].entrance_status !== 0) {
            return { engName: ticketStatus[0].types, thaiName: ticketStatus[0].ticketType, priceType: ticketStatus[0].priceType, status: "not used" };
        } else if (ticketStatus[0].status_ticket === 1) {
            return {
                engName: ticketStatus[0].types,
                thaiName: ticketStatus[0].ticketType,
                priceType: ticketStatus[0].priceType,
                status: "no more rides to play",
            };
        } else {
            const cooldownCheckSql = (await connection).format(
                `SELECT updated_at FROM purchaseticketofrides
                WHERE id_purchasetickettypes = ?
                ORDER BY updated_at DESC
                LIMIT 1;`,
                [_id]
            );
            const [lastPlayTime] = await (await connection).execute<RowDataPacket[]>(cooldownCheckSql);
            const t1 = new Date();
            const t2 = new Date(lastPlayTime[0].updated_at);
            const diffTime = (t1.getTime() - t2.getTime()) / 1000;
            if (diffTime <= 300) {
                return {
                    engName: ticketStatus[0].types,
                    thaiName: ticketStatus[0].ticketType,
                    priceType: ticketStatus[0].priceType,
                    cooldown: 5 - Math.floor(diffTime / 60),
                    status: "cooldown",
                };
            }

            return { engName: ticketStatus[0].types, thaiName: ticketStatus[0].ticketType, priceType: ticketStatus[0].priceType, status: "success" };
        }
    } catch (error) {
        console.log("Error Found In verifyTicket: " + error);
        return "error";
    }
}

export async function findEmployeeRideId(employeeId: string): Promise<{ rideId: string; rideName: string } | false> {
    try {
        const findIdSql = (await connection).format(`SELECT id_rides FROM employee WHERE _id = ?`, [employeeId]);
        const [[employeeRideId]] = await (await connection).execute<RowDataPacket[]>(findIdSql);
        const findRideSql = (await connection).format(`SELECT name_rides_thai FROM rides WHERE _id = ?;`, [employeeRideId.id_rides]);
        const [[findRideName]] = await (await connection).execute<RowDataPacket[]>(findRideSql);
        return { rideId: employeeRideId.id_rides, rideName: findRideName.name_rides_thai };
    } catch (error) {
        console.log("Error Found In findEmployeeRideId: " + error);
        return false;
    }
}

export async function updateUsedCount(
    id_purchasetickettypes: string,
    rideId: string,
    tickettype: string,
    nowTime: Date
): Promise<"success" | "limit" | "error"> {
    try {
        if (tickettype === "Entrance") {
            const sql = (await connection).format(
                `UPDATE purchaseticketofrides SET used_count = 1, updated_at = ? WHERE id_purchasetickettypes = ? AND id_rides = ?;`,
                [nowTime, id_purchasetickettypes, rideId]
            );
            await (await connection).execute(sql);
            return "success";
        } else {
            const findSql = (await connection).format(
                `SELECT used_count, used_limit FROM purchaseticketofrides WHERE id_purchasetickettypes = ? AND id_rides = ?;`,
                [id_purchasetickettypes, rideId]
            );
            const [[usageRows]] = await (await connection).execute<RowDataPacket[]>(findSql);
            if (usageRows.used_count >= usageRows.used_limit) {
                return "limit";
            } else {
                const updateSql = (await connection).format(
                    `UPDATE purchaseticketofrides SET used_count = ?, updated_at = ? WHERE id_purchasetickettypes = ? AND id_rides = ?;`,
                    [++usageRows.used_count, nowTime, id_purchasetickettypes, rideId]
                );
                await (await connection).execute(updateSql);
                return "success";
            }
        }
    } catch (error) {
        console.log("Error Found In updateUsedCount: " + error);
        return "error";
    }
}

export async function updateStatusTicket(id_purchasetickettypes: string, ticketType: string, nowTime: Date): Promise<boolean> {
    try {
        if (ticketType === "Entrance") {
            const sql = (await connection).format(`UPDATE purchasetickettypes SET status_ticket = 1, updated_at = ? WHERE _id = ?;`, [
                nowTime,
                id_purchasetickettypes,
            ]);
            await (await connection).execute(sql);
        } else if (ticketType === "IncludeRides") {
            await updateIncludeStatus(id_purchasetickettypes, nowTime);

            const findSql = (await connection).format(`SELECT used_count FROM purchaseticketofrides WHERE id_purchasetickettypes = ?;`, [
                id_purchasetickettypes,
            ]);
            const [usedCountRows] = await (await connection).execute<RowDataPacket[]>(findSql);
            const usedCountLength = usedCountRows.length;
            let count = 0;
            for (let i = 0; i < usedCountLength; i++) {
                if (usedCountRows[i].used_count === 1) {
                    count++;
                }
            }
            if (count === usedCountLength) {
                const updateSql = (await connection).format(`UPDATE purchaseticket SET status = 3, updated_at = ? WHERE _id = ?;`, [
                    nowTime,
                    id_purchasetickettypes,
                ]);
                await (await connection).execute(updateSql);
            }
        }
        return true;
    } catch (error) {
        console.log("Error Found In updateStatusTicket: " + error);
        return false;
    }
}

export async function updateRoundRides(rideId: string): Promise<boolean> {
    try {
        const nowDate = new Date();
        const findSql = (await connection).format(
            `SELECT rrtf._id, rrtf.used_count FROM roundrides rr
            JOIN roundridesofticketfastpass rrtf
                ON rr._id = rrtf.id_roundrides
            WHERE rr.id_rides = ? AND rr.start_time > ? AND rrtf.types = 'Normal'
            ORDER BY start_time LIMIT 1;`,
            [rideId, `${nowDate.getHours()}:${nowDate.getMinutes()}`]
        );
        const [nextRound] = await (await connection).execute<RowDataPacket[]>(findSql);
        const updateSql = (await connection).format(
            `UPDATE roundridesofticketfastpass
            SET used_count = ?
            WHERE _id = ?;`,
            [++nextRound[0].used_count, nextRound[0]._id]
        );
        await (await connection).execute(updateSql);
        return true;
    } catch (error) {
        console.log("Error Found In updateStatusTicket: " + error);
        return false;
    }
}

async function updateIncludeStatus(id_purchasetickettypes: string, nowTime: Date) {
    try {
        const findSql = (await connection).format(`SELECT status_ticket FROM purchasetickettypes WHERE _id = ?;`, [id_purchasetickettypes]);
        const [[status_ticketRows]] = await (await connection).execute<RowDataPacket[]>(findSql);
        if (status_ticketRows.status_ticket === 0) {
            const updateSql = (await connection).format(`UPDATE purchasetickettypes SET status_ticket = 1, updated_at = ? WHERE _id = ?`, [
                nowTime,
                id_purchasetickettypes,
            ]);
            await (await connection).execute(updateSql);
        }
        return true;
    } catch (error) {
        console.log("Error Found In updateIncludeStatus: " + error);
        return false;
    }
}
