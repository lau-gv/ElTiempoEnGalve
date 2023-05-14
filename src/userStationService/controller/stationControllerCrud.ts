import { APIGatewayProxyEvent } from "aws-lambda";
import { MissingFieldError, handleError } from "../../common/utils/Validator";
import { createRandomId, parseJSON } from "../../common/utils/utils";
import { createStationDynamo, deleteStationDynamo, updateStationDynamo } from "../../common/services/repository/EstacionRepository/DynamoStationDB";


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
        validateAsStationData(data);
        await deleteStationDynamo(tableName, data);
        
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

export async function createStation(event: APIGatewayProxyEvent, tableName : string){

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
        
        const data = parseJSON(event.body)
        data.id = createRandomId();
        validateAsStationData(data);
        await createStationDynamo(tableName, data);
        
        return {
            statusCode: 201, 
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    
    } catch (error : any){
        return handleError(error);
    }
}

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
        validateAsStationData(data);
        await updateStationDynamo(tableName, data);
        
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


function validateAsStationData(arg: any){
    if ((arg as Station).userId == undefined) {
        throw new MissingFieldError('user')
    }
    if ((arg as Station).id == undefined) {
        throw new MissingFieldError('id')
    }
    if ((arg as Station).authStation == undefined) {
        throw new MissingFieldError('authStation')
    }
    if ((arg as Station).location == undefined) {
        throw new MissingFieldError('location')
    }
    if ((arg as Station).name == undefined) {
        throw new MissingFieldError('name')
    }
    if ((arg as Station).type == undefined) {
        throw new MissingFieldError('type')
    }
}
