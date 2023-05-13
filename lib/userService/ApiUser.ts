import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Stack } from 'aws-cdk-lib';
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Construct } from "constructs"
import { join } from "path";
import { ApiWithDomain } from "../constructs/ApiWithDomain";
import { USER_SUB_DOMAIN } from "../domain/domainConstants";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Table } from "aws-cdk-lib/aws-dynamodb";


//Aquí quiero crear un dominio
//Un certificado
//Una api con un subdominio.
interface ApiUserProps {
    wildcard: Certificate,
    hostedZone : HostedZone;
    stationTable: Table;
}


export class ApiUser extends Construct {

    constructor(scope: Construct, id: string, props : ApiUserProps){
        super(scope, id);

        const api = new ApiWithDomain(this, 'ApiWithDomainUser', {
            apiId: 'UserApi',
            ARecordId: 'UserApiRecord',
            domain: USER_SUB_DOMAIN,
            hostedZone : props.hostedZone,
            wildcard: props.wildcard
        }).api;

        const stationResource = api.root.addResource('station');

        //Creamos las Lambdas:
        const createStation = new NodejsFunction(this, 'createStationLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userService', 'lambdas', 'receiverLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        const deleteStation = new NodejsFunction(this, 'deleteStationLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userService', 'lambdas', 'receiverLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        const getUserStations = new NodejsFunction(this, 'userService', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userService', 'lambdas', 'receiverLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        //Asociamos una lambda a cada método para el recurso creado
        stationResource.addMethod('POST', new LambdaIntegration(createStation));
        stationResource.addMethod('DELETE', new LambdaIntegration(deleteStation));
        stationResource.addMethod('GET', new LambdaIntegration(getUserStations));
    }
}