import { APIGatewayProxyEvent, Context } from "aws-lambda";

import { getBetweenStationDataController } from "../controllers/stationData/getStationDataBetweenDate";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{
    
    return await getBetweenStationDataController(event, TABLE_NAME);
}
