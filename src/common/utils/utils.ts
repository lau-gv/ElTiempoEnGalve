import { APIGatewayProxyEvent } from "aws-lambda";;
import * as querystring  from 'querystring';



export function generateRandomId(){
    return Math.random().toString(40).slice(2);
}

export function getEventBody(event: APIGatewayProxyEvent){
    return typeof event.body == 'object'? event.body: getEventBodyVariableHeaders(event);
}

export function getEventBodyVariableHeaders(event: APIGatewayProxyEvent){

    if (!event.body){
        return {} ;
    }

    if (event.headers['content-type'] === 'application/json' 
    || event.headers['Content-Type'] === 'application/json') {
        return JSON.parse(event.body);
    } else if (event.headers['content-type'] === 'application/x-www-form-urlencoded'
    || event.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        return JSON.parse(JSON.stringify(querystring.parse(event.body)));
    }
}

export function roundTwoDecimals(number: number) : number{
    return Math.round(number * 100) / 100
}

