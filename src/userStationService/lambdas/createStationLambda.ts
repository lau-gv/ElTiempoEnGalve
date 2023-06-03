import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { createStation } from "../controller/createStation/stationCreateController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{
    
    return await createStation(event, TABLE_NAME);
}
