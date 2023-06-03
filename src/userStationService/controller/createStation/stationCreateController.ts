import { APIGatewayProxyEvent } from "aws-lambda";
import { MissingFieldError, UnexpectedFieldError, handleError } from "../../../common/utils/Validator";
import { createRandomId, parseJSON } from "../../../common/utils/utils";
import { createStationDynamo } from "../../../common/services/repository/EstacionRepository/DynamoStationDB";
import { createStationManager } from "./stationManageCreation";
import { StationType, WeatherStationModel } from "../../model/WeatherStationModel";


export async function createStation(event: APIGatewayProxyEvent, tableName : string){

    console.log('StationTypeStationType!!!!: {StationType.ecowitt.valueOf()}');
    console.log(StationType.ecowitt);
    console.log(StationType.ecowitt.valueOf());
    try{
        if(!event.body){
            return {
                statusCode: 400, 
                body: JSON.stringify({
                    error: "solicitud incompleta",
                    message: 'cuerpo de mensaje erroneo',
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }
        console.log('StationTypeStationType!!!!: {StationType.ecowitt.valueOf()}');
        console.log(StationType.ecowitt);
        const data = parseJSON(event.body)
        validateAsStationToCreate(data);
        data.stationId = createRandomId();
        var station = createStationManager(data);
        await createStationDynamo(tableName, station);
        
        return {
            statusCode: 201, 
            body: JSON.stringify(station),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    
    } catch (error : any){
        return handleError(error);
    }
}


function validateAsStationToCreate(arg: any){

    const allowedFields = ['userId', 'authStation', 'key', 'location', 'name', 'type'];

    for (const field in arg) {
        if (!allowedFields.includes(field)) {
            throw new UnexpectedFieldError(field);
        }
    }
    if ((arg as WeatherStationModel).userId == undefined) {
        throw new MissingFieldError('userId')
    } 
    if ((arg as WeatherStationModel).location == undefined) {
        throw new MissingFieldError('location')
    }
    if ((arg as WeatherStationModel).name == undefined) {
        throw new MissingFieldError('name')
    }
    if ((arg as WeatherStationModel).type == undefined){
        throw new MissingFieldError('type')
    }
}
