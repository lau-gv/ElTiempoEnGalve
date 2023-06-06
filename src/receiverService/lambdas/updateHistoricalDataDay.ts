import { Context } from "aws-lambda";
import { updateHistoricalDayData } from "../controller/UpdateHistoricalDataDayController";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: any, context: Context): Promise<any>{

    return await updateHistoricalDayData(event, TABLE_NAME);
}
