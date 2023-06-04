import { APIGatewayProxyEvent } from "aws-lambda";
import { MissingFieldError, UnexpectedFieldError, handleError } from "../../../common/utils/Validator";
import { createRandomId, parseJSON } from "../../../common/utils/utils";
import { createStationDynamo, deleteStationDynamo, updateStationDynamo } from "../../../common/services/repository/EstacionRepository/DynamoStationDB";
import { WeatherStationModel } from "../../model/WeatherStationModel";
import { updateStationManager } from "./stationManageUpdate";

export async function updateStation(event: APIGatewayProxyEvent, tableName : string){

    try{
        if(!event.body){
            return {
                statusCode: 400, 
                body: JSON.stringify("cuerpo de mensaje erroneo"),
                headers: {
                    'Content-Type': 'application/json'
                }                
            };
        }
        
        const data = parseJSON(event.body)
        validateAsStation(data);
        var station = updateStationManager(data);
        await updateStationDynamo(tableName, station);
        
        return {
            statusCode: 200, 
            body: (JSON.stringify(data)),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    
    } catch (error : any){
        return handleError(error);
    }
}
function validateAsStation(arg: any){

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
    
    if ((arg as WeatherStationModel).authStation == undefined) {
        throw new MissingFieldError('authStation')
    }
    if ((arg as WeatherStationModel).location == undefined) {
        throw new MissingFieldError('location')
    }
    if ((arg as WeatherStationModel).name == undefined) {
        throw new MissingFieldError('name')
    }
    if ((arg as WeatherStationModel).type == undefined) {
        throw new MissingFieldError('type')
    }
}
