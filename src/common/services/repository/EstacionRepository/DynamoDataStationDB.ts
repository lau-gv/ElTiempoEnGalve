import { AWSError, DynamoDB } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { getFirstByIndex, createDataOnDynamo } from "../DynamoDataAcess";

export async function insertStationData(table_name: string, item: any) {            
    const result: PutItemCommandOutput = await createDataOnDynamo(table_name, item, 'id', 'datadatetime');
    console.log("Este es el resultado" + JSON.stringify(result));
    return result;
    //return unmarshall(result.Attributes) as StationData; 
}
