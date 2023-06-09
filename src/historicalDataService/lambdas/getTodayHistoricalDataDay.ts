import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { getTodayHistoricalDataDay } from "../controllers/historicalData/getTodayHistoricalDataController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{
    
    return await getTodayHistoricalDataDay(event, TABLE_NAME);
}
