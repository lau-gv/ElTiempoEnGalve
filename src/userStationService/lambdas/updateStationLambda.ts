import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { updateStation } from "../controller/updateStation/stationUpdateController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{

    return await updateStation(event, TABLE_NAME);
}