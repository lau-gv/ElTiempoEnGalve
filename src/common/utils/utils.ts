import { APIGatewayProxyEvent } from "aws-lambda";
import * as querystring  from 'querystring';
import { JsonError } from "./Validator";
import { randomUUID } from "crypto";

export function createRandomId(){
    return randomUUID();
}

export function TwoDecimals(number: number): number{
    return Math.round(number * 100) / 100;
}


export function parseJSON(arg: string){
    try {
        return JSON.parse(arg);
    } catch (Error : any) {
        throw new JsonError(Error.message)
    }
}

export function getEventBody(event: APIGatewayProxyEvent){
    try {
        typeof event.body == 'object'? event.body: getEventBodyVariableHeaders(event);  
    } catch (Error : any) {
        throw new JsonError(Error.message)
    }
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
    }else{
        return {}
    }
}

export function roundTwoDecimals(number: number) : number{
    return Math.round(number * 100) / 100
}

