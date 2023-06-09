import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { getYearHistoricalData } from "../controllers/historicalData/getYearHistoricalDataController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{
    
    return await getYearHistoricalData(event, TABLE_NAME);
}
