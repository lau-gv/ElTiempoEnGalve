import { APIGatewayProxyEvent } from "aws-lambda";
import { parseJSON } from "../../common/utils/utils";
import { MissingFieldError, handleError } from "../../common/utils/Validator";
import { getAllStationsByUserDynamo } from "../../common/services/repository/EstacionRepository/DynamoStationDB";
import { validateAsGetPeticion } from "./validatorGetData";
import { getHistoricalDataDay } from "../../common/services/repository/HistoricalDataRepository/DynamoHistoricalDayData";

export async function getTodayHistoricalData(event: APIGatewayProxyEvent, tableName : string){
    try{
        if(!event.queryStringParameters){
            return {
                statusCode: 400, 
                body: JSON.stringify("cuerpo de mensaje erroneo"),
                headers: {
                    'Content-Type': 'application/json'
                }                
            };
        }        
        
        validateAsGetPeticion(event);
        const stationId = event.queryStringParameters['stationId'];
        const datadate = event.queryStringParameters['datadate'];
        const stations = await getHistoricalDataDay(tableName, parseInt(datadate!), stationId!);
        console.log(stations);
        
        return {
            statusCode: 200, 
            body: JSON.stringify((stations)),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    
    } catch (error : any){
        return handleError(error);
    }
}
