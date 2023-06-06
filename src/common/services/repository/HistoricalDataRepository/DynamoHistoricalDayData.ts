import { DynamoDBClient, GetItemCommand, GetItemCommandInput, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { updateDataOnDynamo } from "../DynamoDataAcess";

const PARTITION_KEY = "stationId";
const SORT_KEY = "datadate";

export async function getHistoricalDataDay(tableName: string, day : number, stationId : string) :
Promise<HistoricalDataDay | undefined> {

    const dbClient = new DynamoDBClient({});

    const params : GetItemCommandInput = {
        TableName: tableName,
        Key: {
            [PARTITION_KEY]: {S : stationId},
            [SORT_KEY]: {N: day.toString()},
          },
      };
  const response = await dbClient.send(new GetItemCommand(params));
  return response.Item ? unmarshall(response.Item) as HistoricalDataDay : undefined
}

export async function putHistoricalData(tableName: string, historicalDataDay : HistoricalDataDay) {
    const response = await updateDataOnDynamo(tableName, historicalDataDay);

}
