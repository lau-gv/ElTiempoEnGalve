import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { getAllStationsByUser } from "../controller/stationsController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{

    return await getAllStationsByUser(event, TABLE_NAME);
}