import { DynamoDBClient, GetItemCommand, GetItemCommandInput, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getAllByQuery, updateDataOnDynamo } from "../DynamoDataAcess";

const PARTITION_KEY = "stationId";
const SORT_KEY = "datadate";

export async function putHistoricalData(tableName: string, historicalDataDay : HistoricalDataDay) {
    const response = await updateDataOnDynamo(tableName, historicalDataDay);
}

export async function getHistoricalDataDay(tableName: string, day : number, stationId : string) :
Promise<HistoricalDataDay | undefined> {

    const dbClient = new DynamoDBClient({});

    const params : GetItemCommandInput = {
        TableName: tableName,
        Key: {
            [PARTITION_KEY]: {S: stationId},
            [SORT_KEY]: {N : day.toString()},
          },
      };

  const response = await dbClient.send(new GetItemCommand(params));
  return response.Item ? unmarshall(response.Item) as HistoricalDataDay : undefined
}

export async function getHistoricalDataDayBetween(tableName: string, stationId : string, startDate : string, endDate : string ) :
    Promise<HistoricalDataDay[] | undefined>{

    const keyConditionExpression = "#stationId = :stationId AND #datadate BETWEEN :startDatadateValue AND :endDatadateValue";
    const expressionAttributeNames = { 
        '#stationId': PARTITION_KEY,       
        "#datadate": SORT_KEY,       
    }
    const expressionAttributeValues = {
        ":stationId": {S: stationId},
        ":startDatadateValue": {N: startDate},
        ":endDatadateValue": {N: endDate},
    };

    console.log(startDate)
    console.log(endDate)
    const response = await getAllByQuery(tableName, keyConditionExpression, expressionAttributeNames, expressionAttributeValues);
    return  response.Items?.map((station) => unmarshall(station) as HistoricalDataDay) ;
}
