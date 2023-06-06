import { AWSError, DynamoDB } from "aws-sdk";
import { deleteDataOnDynamo, getAllByQuery, getFirstByIndex, createDataOnDynamo, updateDataOnDynamo } from "../DynamoDataAcess";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { WeatherStationModel } from "../../../../userStationService/model/WeatherStationModel";



export async function getIdByAuthStation(tableName: string, authStation: string): Promise<string | undefined> {
    const stationDynamo : DynamoDB.AttributeMap | undefined = (await getFirstByIndex(tableName, "authStation", authStation));
    return stationDynamo?.['stationId'].S;
}

export async function getAllStationsByUserDynamo(tableName: string, userId: string) :
    Promise<WeatherStationModel[] | undefined>{

    const keyConditionExpression = "#keyName = :keyValue";
    const expressionAttributeNames = {'#keyName': "userId",}
    const expressionAttributeValues = {
        ":keyValue": {S: userId},
      };

    const response = await getAllByQuery(tableName, keyConditionExpression, expressionAttributeNames, expressionAttributeValues);
    return  response.Items?.map((station) => unmarshall(station) as WeatherStationModel) ;
}

export async function createStationDynamo(tableName: string, station: WeatherStationModel) {

    const response = await createDataOnDynamo(tableName, station, 'userId', 'stationId')
}

export async function deleteStationDynamo(tableName: string, station: WeatherStationModel)  {
    const response = await deleteDataOnDynamo(tableName, station.userId, 'userId', station.stationId, 'stationId');
    return response.Attributes;
    //const response 
}

export async function updateStationDynamo(tableName: string, station: WeatherStationModel) {
    //De esta manera va a poder actualizar todo. Lo cual, no es exactamente bien. Pero me da igual XD :(
    const response = await updateDataOnDynamo(tableName, station);
    //const response 
}