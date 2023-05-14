import { AWSError, DynamoDB } from "aws-sdk";
import { deleteDataOnDynamo, getAllByQueryString, getFirstByIndex, createDataOnDynamo, updateDataOnDynamo } from "../DynamoDataAcess";
import { unmarshall } from "@aws-sdk/util-dynamodb";



export async function getIdByAuthStation(tableName: string, authStation: string): Promise<string | undefined> {
    const stationDynamo : DynamoDB.AttributeMap | undefined = (await getFirstByIndex(tableName, "authStation", authStation));
    return stationDynamo?.['id'].S;
}

export async function getAllStationsByUserDynamo(tableName: string, userId: string) :
    Promise<Station[] | undefined>{

    const response = await getAllByQueryString(tableName, "userId", userId);
    return  response.Items?.map((station) => unmarshall(station) as Station) ;
}

export async function createStationDynamo(tableName: string, station: Station) {

    const conditionExpresion =  `attribute_not_exists(userId) AND attribute_not_exists(id) AND attribute_not_exists(authStation) AND (NOT contains(authStation, :val))`;
    const expressionAttributeValues = {
        ':val' : {S : station.authStation}
    };
    const response = await createDataOnDynamo(tableName, station, 'userId', 'id')
}

export async function deleteStationDynamo(tableName: string, station: Station) {
    const response = await deleteDataOnDynamo(tableName, station.userId, 'userId', station.id, 'id');
    //const response 
}

export async function updateStationDynamo(tableName: string, station: Station) {
    const response = await updateDataOnDynamo(tableName, station);
    //const response 
}