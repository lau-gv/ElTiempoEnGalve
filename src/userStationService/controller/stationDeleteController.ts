import { APIGatewayProxyEvent } from "aws-lambda";
import { deleteStationDynamo } from "../../common/services/repository/EstacionRepository/DynamoStationDB";
import { MissingFieldError, UnexpectedFieldError, handleError } from "../../common/utils/Validator";
import { parseJSON } from "../../common/utils/utils";
import { WeatherStationModel } from "../model/WeatherStationModel";

export async function deleteStation(event: APIGatewayProxyEvent, tableName : string){

    try{
        if(!event.body){
            return {
                statusCode: 400, 
                body: JSON.stringify("cuerpo de mensaje erroneo"),
                headers: {
                    'Content-Type': 'application/json',
                }
            };
        }
        
        const data = parseJSON(event.body)
        validateAsDeleteStation(data);
        const response = await deleteStationDynamo(tableName, data);
        //console.log(response);
        

        return {
            statusCode: 201, 
            body: JSON.stringify(`Deleted station: ${data.name}`),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    
    } catch (error : any){
        return handleError(error);
    }
}

function validateAsDeleteStation(arg: any){

    const allowedFields = ['userId', 'stationId', 'authStation', 'key', 'location', 'name', 'type'];

    for (const field in arg) {
        if (!allowedFields.includes(field)) {
            throw new UnexpectedFieldError(field);
        }
    }
    if ((arg as WeatherStationModel).userId == undefined) {
        throw new MissingFieldError('userId')
    }
    if ((arg as WeatherStationModel).stationId == undefined) {
        throw new MissingFieldError('stationId')
    }
}