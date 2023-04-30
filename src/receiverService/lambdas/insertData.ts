import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Context } from "aws-lambda";
import { insertData } from "../controller/insertDataController";

const TABLE_NAME = process.env.TABLE_NAME || '';
const dbClient = new DynamoDBClient({});

export async function handler(event: any, context: Context): Promise<any>{

    console.log(event.Payload.body);
    insertData(event, TABLE_NAME, dbClient);
}

