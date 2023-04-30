import { APIGatewayProxyEvent } from "aws-lambda";
import { getEventBodyVariableHeaders } from "../../common/utils/utils";
import { sendMessageToQueue } from "../../common/services/QueueService";
import { SQSClient } from "@aws-sdk/client-sqs";


export async function receiveData(event: APIGatewayProxyEvent, queueDataUrl: string, sqsClient: SQSClient){
    
    const time : string = getTimeInSpain();
    
    try{
        var data = getItemData(event);
        if(!validateData(data)){
            return {
                statusCode: 400,
                body: JSON.stringify({error: "Invalid data "})
            }
        }
        data.spainTime = time;
        console.error(data);
        await sendMessageToQueue(data, queueDataUrl, sqsClient);
        return {
            statusCode: 200, 
            body: JSON.stringify(data)
        };
        
    } catch (error) {
        console.error("Error handling data request: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
}

export function getTimeInSpain(): string {

    const date = new Date();
    const currentTime = date.toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
    }).replace(/:|\s/g, '');
    const month = (date.getMonth()+ 1).toString().length !=2 
        ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
    
    const day = (date.getDate()).toString().length !=2 
    ? `0${date.getDate()}` : `${date.getDate()}`
    
    //const month = ((date.getMonth()+1).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1))
    const currentDate = `${date.getFullYear()}${month}${day}`;
    return `${currentDate}${currentTime}`;
}

function getItemData(event: APIGatewayProxyEvent) {

    var item;

    if (event.httpMethod === 'POST'){
            item = getEventBodyVariableHeaders(event);
    }else if (event.httpMethod === 'GET'){
            item = event.queryStringParameters === null ? {} : 
            JSON.parse(JSON.stringify(event.queryStringParameters));
    }
    return item;
}

function validateData(data: any): boolean {
    return (
        (data.hasOwnProperty("PASSKEY")) ||
        (data.hasOwnProperty("station_id") && data.hasOwnProperty("station_key"))
    );
}