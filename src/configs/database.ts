import mysql from "mysql2/promise";
require("dotenv").config();

const databaseAccount = {
    namedPlaceholders: true,
    host: process.env.HOST,
    // port: 12635,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};

export const connection = mysql.createConnection(databaseAccount); //create connection

//-----------------------------------Database-Connection-Testing---------------------------------//
export async function testConnectDb() {
    try {
        await connection;
        console.log("Connected!");
    } catch (err) {
        console.log("Can't Connect!!!\nError: " + err);
    }
}
//-----------------------------------------------------------------------------------------------//
