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
        console.log(event);
        console.log(data);
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
  const timeZone = 'Europe/Madrid';

  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const formattedDate = date.toLocaleString('es-ES', options).replace(/\/|,|:|\s/g, '');
  const day = formattedDate.substring(0, 2);
  const month = formattedDate.substring(2, 4);
  const year = formattedDate.substring(4, 8);
  const hour = formattedDate.substring(8, 10);
  const min = formattedDate.substring(10, 12);
  const sec = formattedDate.substring(12, 14);
  //0DD 2MM 4 YYYY 9HH 11 MM 13 SS15

  return `${year}${month}${day}${hour}${min}${sec}` ;
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

//Sería mas correcto validar todos los campos. Pero es que.. son "tantos" XD.
function validateData(data: any): boolean {
    return (
        (data.hasOwnProperty("PASSKEY")) ||
        //(data.hasOwnProperty("station_id") && data.hasOwnProperty("station_key"))
        (data.hasOwnProperty("ID") && data.hasOwnProperty("PASSWORD"))
    );
}