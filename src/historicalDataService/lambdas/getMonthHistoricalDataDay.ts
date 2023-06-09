import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { getMonthHistoricalData } from "../controllers/historicalData/getMonthHistoricalDataController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{
    
    return await getMonthHistoricalData(event, TABLE_NAME);
}
