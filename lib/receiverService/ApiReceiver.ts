import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Stack } from 'aws-cdk-lib';
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs"
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { join } from "path";



export class ApiReceiver extends Construct {

    public readonly queue: Queue;
    public readonly receiverLambda: NodejsFunction;


    constructor(scope: Construct, id: string){
        super(scope, id);

       this.queue = new Queue(this, 'Queue');

        this.receiverLambda = new NodejsFunction(this, 'ReceiverLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'receiverService', 'lambdas', 'receiverLambda.ts')),
            environment: {
                QUEUE: this.queue.queueUrl,
            }
        });

        this.queue.grantSendMessages(this.receiverLambda);

        const markTimeLambdaIntegration = new LambdaIntegration(this.receiverLambda);

        const api = new RestApi(this, 'ReceiverStationDataApi', {

        });
        //Ahora creamos el recurso  insertTime
        const receiveData = api.root.addResource('receiveData');
        //Esto lo hacemos así porque la estación en forma wunderground envía 
        //una petición get. Que no POST.
        receiveData.addMethod('GET', markTimeLambdaIntegration);
        receiveData.addMethod('POST', markTimeLambdaIntegration);
        
          
        const origin = new origins.HttpOrigin(`${api.restApiId}.execute-api.${Stack.of(this).region}.amazonaws.com`, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
            httpsPort: 443,
            originPath: "/prod/receiveData",
        });

        const distribution = new cloudfront.Distribution(this, 'ReceiveDataCloudFront', {
            defaultBehavior: {
                origin: origin,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                compress: false,                
                originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
            },  
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,       
            
        });
    }
}