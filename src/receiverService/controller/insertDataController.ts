import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { insertStationData } from "../../common/services/repository/EstacionRepository/DynamoStationDB";



export async function insertData(event: any, TABLE_NAME: string, dbClient : DynamoDBClient){    
    try{
        const body= JSON.parse(event.Payload.body);
        await insertStationData(TABLE_NAME, body, dbClient);

        return  {
            "statusCode": 201,
            "body": body
        };
    }catch(Error: any){
        console.log(`Errorcito!: ${Error.message}`);
        return {
            "statusCode": 500,
            "body": `Error al insertar los datos: ${Error.message}`
        };
    }
}