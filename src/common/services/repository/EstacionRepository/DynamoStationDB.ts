import { AWSError, DynamoDB } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { getFirstByIndex, insertDataOnDynamo } from "../DynamoDataAcess";

export async function insertStationData(table_name: string, item: any, dbClient: DynamoDBClient) : Promise<StationData | Error> {
        
    const result: PutItemCommandOutput | undefined = await insertDataOnDynamo(table_name, item, dbClient);
    if (result != undefined && result.Attributes) {
        return unmarshall(result.Attributes) as StationData;
     } else {
        throw new Error('no se pudo recuperar el objeto');
    }
}

export async function getIdByAuthStation(table_name: string, value: string): Promise<string | undefined> {
    const stationDynamo : DynamoDB.AttributeMap | undefined = (await getFirstByIndex(table_name, "authStation", value));
    return stationDynamo?.['id'].S;
}

export {getFirstByIndex, insertDataOnDynamo}
