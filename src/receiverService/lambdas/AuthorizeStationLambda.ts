import { Context } from "aws-lambda";
import { authorizeStation } from "../controller/AuthorizeStationController"


const STATION_TABLE = process.env.TABLE_NAME || '';

export async function handler(event: any, context: Context): Promise<any>{
 
  return await authorizeStation(event, STATION_TABLE);
}









