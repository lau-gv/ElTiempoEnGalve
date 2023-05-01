import { AWSError, DynamoDB } from "aws-sdk";
import { getFirstByIndex, insertDataOnDynamo } from "../DynamoDataAcess";


export async function getIdByAuthStation(table_name: string, value: string): Promise<string | undefined> {
    const stationDynamo : DynamoDB.AttributeMap | undefined = (await getFirstByIndex(table_name, "authStation", value));
    return stationDynamo?.['id'].S;
}
