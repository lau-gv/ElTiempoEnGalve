import { marshall } from "@aws-sdk/util-dynamodb";
import { AWSError, DynamoDB,  } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { DynamoDBClient, QueryCommand, QueryCommandInput, PutItemCommand , PutItemCommandInput, PutItemCommandOutput, ScanCommand} from "@aws-sdk/client-dynamodb";

export {getFirstByIndex, getAllByIndex, insertDataOnDynamo}


async function getFirstByIndex(table_name: string, indexName: string, value: string)
: Promise<DynamoDB.AttributeMap | undefined> {

    const atributosEncontrados: DynamoDB.AttributeMap[] | undefined = await getAllByIndex(table_name, indexName, value);
    return atributosEncontrados?.shift();
}

async function getAllByIndex(table_name: string, indexName: string, value: string)
: Promise<DynamoDB.AttributeMap[] | undefined> {
    const dbClient = new DynamoDBClient({});

    const params = {
        TableName: table_name,
        IndexName: indexName,
        FilterExpression: '#indexName = :value',
        ExpressionAttributeNames: {
          '#indexName': indexName,
        },
        ExpressionAttributeValues: {
          ':value': {S: value},
        },
      };
      const queryCommand = new ScanCommand(params);
      const queryResponse = await dbClient.send(queryCommand);
      return queryResponse.Items;
}

async function updateDataOnDynamo(tableName: string, item: any, dbClient: DynamoDBClient): 
Promise<PutItemCommandOutput>{
  const params = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item)
  });    
  return await dbClient.send(params);
}

async function insertDataOnDynamo(tableName: string, item: any, dbClient: DynamoDBClient, partitionKey : string,  sortKey : string): 
Promise<PutItemCommandOutput>{
  const params = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
      ConditionExpression : `attribute_not_exists(${partitionKey}) AND attribute_not_exists(${sortKey})`
  });    
  return await dbClient.send(params);
}
