import { APIGatewayProxyEvent } from "aws-lambda";
import { parseJSON } from "../../common/utils/utils";
import { MissingFieldError, handleError } from "../../common/utils/Validator";
import { getAllStationsByUserDynamo } from "../../common/services/repository/EstacionRepository/DynamoStationDB";

export async function getAllStationsByUser(event: APIGatewayProxyEvent, tableName : string){
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
        
        validateEntry(event);
        const userId = event.queryStringParameters['userId'];
        const stations = await getAllStationsByUserDynamo(tableName, userId!);
        //console.log(stations);
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

function validateEntry(event: APIGatewayProxyEvent){
    if (!('userId' in event.queryStringParameters!)) {
        throw new MissingFieldError('userId')
    }
}


