import { Context } from "aws-lambda";

export async function handler (event: any, context: Context): Promise<any>{

    console.log(`Por desarrollar: ${event.Payload.body}`);

}