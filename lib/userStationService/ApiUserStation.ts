import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
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
import { IUserPool } from "aws-cdk-lib/aws-cognito";


//Aquí quiero crear un dominio
//Un certificado
//Una api con un subdominio.
export interface ApiUserProps {
    stationTable: Table;
    userPool : IUserPool;
}


export class ApiUserStation extends Construct {

    constructor(scope: Construct, id: string, props : ApiUserProps){
        super(scope, id);

        //Creamos las Lambdas:
        const createStation = new NodejsFunction(this, 'CreateStationLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userStationService', 'lambdas', 'createStationLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        const deleteStation = new NodejsFunction(this, 'DeleteStationLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userStationService', 'lambdas', 'deleteStationLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        const getUserStations = new NodejsFunction(this, 'GetAllStationByUserLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userStationService', 'lambdas', 'getUserStationsLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        const updateStation = new NodejsFunction(this, 'UpdateStationLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userStationService', 'lambdas', 'updateStationLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        //Tenemos que dar permisos sobre la tabla stationTable.
        props.stationTable.grantReadData(getUserStations);
        props.stationTable.grantWriteData(createStation);
        props.stationTable.grantWriteData(deleteStation);
        props.stationTable.grantWriteData(updateStation);

        //Api.
        const api = new RestApi(this, 'UserStationApi', {});

        const authorizer = new CognitoUserPoolsAuthorizer(this, 'UserAuthorizer', {
            cognitoUserPools:[props.userPool],
            identitySource: 'method.request.header.Authorization'
        });

        authorizer._attachToApi(api);

        const optionWithauth : MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }
        const stationResource = api.root.addResource('station');
        const stationsResource = api.root.addResource('stations');

        //Asociamos una lambda a cada método para el recurso creado y le añadimos la autorización.
        stationResource.addMethod('POST', new LambdaIntegration(createStation), optionWithauth);
        stationResource.addMethod('DELETE', new LambdaIntegration(deleteStation), optionWithauth);
        stationResource.addMethod('PUT', new LambdaIntegration(updateStation), optionWithauth);
        //stations
        stationsResource.addMethod('GET', new LambdaIntegration(getUserStations), optionWithauth);
    }
}