import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { getTodayHistoricalData } from "../controllers/getTodayHistoricalDataController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{
    
    await getTodayHistoricalData(event, TABLE_NAME);
}
