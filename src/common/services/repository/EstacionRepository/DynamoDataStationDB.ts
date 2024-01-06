import { AWSError, DynamoDB } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {  PutItemCommandOutput, QueryCommand } from "@aws-sdk/client-dynamodb";
import {  createDataOnDynamo, getAllByQuery, getByQueryCommand } from "../DynamoDataAcess";

const PARTITION_KEY = "stationId";
const SORT_KEY = "datadatetime";

export async function insertStationData(table_name: string, item: any) {            
    const result: PutItemCommandOutput = await createDataOnDynamo(table_name, item, 'id', 'datadatetime');
    console.log("Este es el resultado" + JSON.stringify(result));
    return result;
    //return unmarshall(result.Attributes) as StationData; 
}

export async function getLastStationData(tableName: string, stationId : string,) {
    
    const command = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: '#stationId = :id',
        ExpressionAttributeValues: {
          ':id': { S: stationId } // Establece aquí tu stationId específico
        },
        ExpressionAttributeNames: {
            '#stationId' : PARTITION_KEY
        },
        ScanIndexForward: false,
        Limit: 1
    });    

    const response = await getByQueryCommand(tableName, command);
    return response.Items ? unmarshall(response.Items[0]) as StationData : undefined
}

export async function getStationDataBetween(tableName: string, stationId : string, startDate : string, endDate : string ) :
    Promise<StationData[] | undefined>{

    const keyConditionExpression = "#stationId = :stationId AND #datadatetime BETWEEN :startDatadateValue AND :endDatadateValue";
    const expressionAttributeNames = { 
        '#stationId': PARTITION_KEY,       
        "#datadatetime": SORT_KEY,       
    }
    const expressionAttributeValues = {
        ":stationId": {S: stationId},
        ":startDatadateValue": {N: startDate},
        ":endDatadateValue": {N: endDate},
    };

    console.log(startDate)
    console.log(endDate)
    const response = await getAllByQuery(tableName, keyConditionExpression, expressionAttributeNames, expressionAttributeValues);
    return  response.Items?.map((station) => unmarshall(station) as StationData) ;
}