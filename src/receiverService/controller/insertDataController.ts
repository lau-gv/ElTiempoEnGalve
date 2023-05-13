import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { insertStationData } from "../../common/services/repository/EstacionRepository/DynamoDataStationDB";


export async function insertData(event: any, TABLE_NAME: string, dbClient : DynamoDBClient){    
    try{
        const body= JSON.parse(event.Payload.body);
        await insertStationData(TABLE_NAME, body, dbClient);
        return  {
            "statusCode": 201,
            "body": body
        };
    }catch(Error: any){

        /*¿Por qué no controlo este error aquí? Porque quiero que lo controle step functions
        y no mi código, así, si algo de la inserción de datos falla, se marca como que ha fallado.
        Si quien leyese fuese una función lambda, el mensaje se devolvería a la cola y habría manejo de errores 
        de forma integrada, pero, al estar lanzando step functions, no sé que pasa. EN PENDIENTES MANEJO DE ERRORES*/
        console.log(`Errorcito!: ${Error.message}`);
        throw new Error(`${Error.message}`);
    }
}