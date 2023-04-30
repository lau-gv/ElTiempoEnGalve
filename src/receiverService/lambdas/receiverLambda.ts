import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { receiveData } from "../controller/ReceiverLambdaController";


//Así pueden ser reutilizados en casa llamada a la función lambda.
const sqsClient = new SQSClient({});
const queueDataUrl = process.env.QUEUE;

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<any>{

        return await receiveData(event, queueDataUrl!, sqsClient);

}
