import { APIGatewayProxyEvent } from "aws-lambda";
import { handleError, UnexpectedFieldError, MissingFieldError, IncompleteBodyError } from "../../../common/utils/Validator";
import { getLastStationData } from "../../../common/services/repository/EstacionRepository/DynamoDataStationDB";
import { stationDataToStationDataGetDto } from "../../dto/stationDataGetDto";


export async function getLastStationDataByStation(event: APIGatewayProxyEvent, tableName : string){
    try{
          
        validatePetition(event);
        const stationId = event.queryStringParameters!['stationId']!;
        const response : StationData | undefined = await getLastStationData(tableName, stationId);


        
        return {
            statusCode: 200, 
            body: JSON.stringify((response ? stationDataToStationDataGetDto(response) : {})),
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
    const allowedFields = ['stationId'];
    const dataDateRegex = /^\d{8}$/;
  
    const arg = event.queryStringParameters;
  
    if (!arg) {
      throw new IncompleteBodyError();
    }
  
    for (const field in arg) {
      if (!allowedFields.includes(field)) {
        throw new UnexpectedFieldError(`${field}`);
      }
    }
  
    if (!arg.stationId) {
      throw new MissingFieldError('stationId');
    }
  }