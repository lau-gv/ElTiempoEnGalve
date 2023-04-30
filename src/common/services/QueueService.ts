import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export async function sendMessageToQueue(data: string, queueDataUrl: string, sqsClient: SQSClient){

    const command = new SendMessageCommand({
            QueueUrl: queueDataUrl,
            MessageBody: JSON.stringify(data)
          });
                
    await sqsClient.send(command);        
}
