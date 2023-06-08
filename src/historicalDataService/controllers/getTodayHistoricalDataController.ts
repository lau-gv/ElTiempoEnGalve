import { APIGatewayProxyEvent } from "aws-lambda";
import { MissingFieldError, UnexpectedFieldError, handleError } from "../../common/utils/Validator";
import { validateAsGetPeticion } from "./validatorGetData";
import { getHistoricalDataDay } from "../../common/services/repository/HistoricalDataRepository/DynamoHistoricalDayData";

export async function getTodayHistoricalDataDay(event: APIGatewayProxyEvent, tableName : string){
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
        
        validatePetition(event);
        const stationId = event.queryStringParameters['stationId'];
        const datadate = event.queryStringParameters['datadate'];
        const historicalDataDay = await getHistoricalDataDay(tableName, parseInt(datadate!), stationId!);
        
        return {
            statusCode: 200, 
            body: JSON.stringify((historicalDataDay ? historicalDataDay : {})),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    
    } catch (error : any){
        console.log(error);
        return handleError(error);
    }
}

export function validatePetition(event: APIGatewayProxyEvent) {
    const allowedFields = ['stationId', 'datadate'];
    const dataDateRegex = /^\d{8}$/;
  
    const arg = event.queryStringParameters;
  
    if (!arg) {
      throw new Error('No se encontraron parámetros en la solicitud');
    }
  
    for (const field in arg) {
      if (!allowedFields.includes(field)) {
        throw new UnexpectedFieldError(`${field}`);
      }
    }
  
    if (!arg.stationId) {
      throw new MissingFieldError('stationId');
    }
  
    if (!arg.datadate || !dataDateRegex.test(arg.datadate)) {
      throw new MissingFieldError('datadate');
    }
  }