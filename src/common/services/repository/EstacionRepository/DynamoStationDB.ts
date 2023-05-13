import { AWSError, DynamoDB } from "aws-sdk";
import { getAllByQueryString, getFirstByIndex, insertDataOnDynamo } from "../DynamoDataAcess";
import { unmarshall } from "@aws-sdk/util-dynamodb";



export async function getIdByAuthStation(tableName: string, value: string): Promise<string | undefined> {
    const stationDynamo : DynamoDB.AttributeMap | undefined = (await getFirstByIndex(tableName, "authStation", value));
    return stationDynamo?.['id'].S;
}

export async function getAllbyUser(tableName: string, value: string) :
    Promise<Station[] | undefined>{

    const response = await getAllByQueryString(tableName, "user", value);
    return  response.Items?.map((station) => unmarshall(station) as Station) ;
}