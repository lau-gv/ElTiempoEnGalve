import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { getBetweenHistoricalDataDayController } from "../controllers/getHistoricalDataDayBetweenController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{
    
    return await getBetweenHistoricalDataDayController(event, TABLE_NAME);
}
