import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { getLastStationDataByStation } from "../controllers/currentData/getTodayCurrentDataController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{
    
    return await getLastStationDataByStation(event, TABLE_NAME);
}
