import { APIGatewayProxyEvent, Context } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<any>{
    
    console.log("todo");
}
