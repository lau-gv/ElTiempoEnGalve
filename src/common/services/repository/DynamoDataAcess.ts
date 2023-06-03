import { marshall } from "@aws-sdk/util-dynamodb";
import { DynamoDB,  } from "aws-sdk";
import { DynamoDBClient, QueryCommand, QueryCommandInput, PutItemCommand , PutItemCommandInput, PutItemCommandOutput, ScanCommand, QueryCommandOutput, DeleteItemCommand, DeleteItemCommandInput, DeleteItemCommandOutput, AttributeValue} from "@aws-sdk/client-dynamodb";
import { ConditionExpression } from "aws-sdk/clients/dynamodb";

export async function getFirstByIndex(table_name: string, indexName: string, value: string)
: Promise<DynamoDB.AttributeMap | undefined> {

    const atributosEncontrados: DynamoDB.AttributeMap[] | undefined = await getAllByIndex(table_name, indexName, value);
    return atributosEncontrados?.shift();
}

export async function getAllByIndex(table_name: string, indexName: string, value: string)
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

export async function updateDataOnDynamo(tableName: string, item: any): 
Promise<PutItemCommandOutput>{
  const dbClient = new DynamoDBClient({});
  const params = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item)
  });    
  return await dbClient.send(params);
}

export async function createDataOnDynamo(tableName: string, item: any, partitionNameKey : 
  string,  sortNameKey : string, expresionAtributeValues? : Record<string, AttributeValue>): 
Promise<PutItemCommandOutput>{

  const dbClient = new DynamoDBClient({});

  const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: true, // false, by default. <-- HERE IS THE ISSUE
};

  const params = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item, marshallOptions),
      ConditionExpression : `attribute_not_exists(${partitionNameKey}) AND attribute_not_exists(${sortNameKey})`,
      ExpressionAttributeValues : expresionAtributeValues !== undefined ? expresionAtributeValues : undefined
  });    

  return await dbClient.send(params);
}

export async function getAllByQueryString(tableName: string, keyName: string, keyValue: string) :
Promise<QueryCommandOutput> {
  const dbClient = new DynamoDBClient({});
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression:
      "#keyName = :keyValue",
    
    ExpressionAttributeNames: {
        '#keyName': keyName,
      },
    ExpressionAttributeValues: {
      ":keyValue": {S: keyValue},
    },
    ConsistentRead: true,
  });

  const response = await dbClient.send(command);
  return response;
}

export async function deleteDataOnDynamo(tableName: string, keyValue : string,  partitionKeyName: string, sortKeyValue : string, sotrKeyName : string)
: Promise<DeleteItemCommandOutput>{
  const dbClient = new DynamoDBClient({});
  const params : DeleteItemCommandInput = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: {S : keyValue},
      [sotrKeyName]: {S : sortKeyValue}
    },
    ReturnValues: 'ALL_OLD'     
  }
  const response = await dbClient.send(new DeleteItemCommand(params));
  return response;
}

