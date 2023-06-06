import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Construct } from "constructs"
import { join } from "path";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { IUserPool } from "aws-cdk-lib/aws-cognito";

export interface ApiHistoricalDataProps {
  
    stationHistoricalDayDataTable: Table;
    userPool : IUserPool;

  }

export class ApiHistoricalData extends Construct {



    constructor(scope: Construct, id: string, props: ApiHistoricalDataProps){
        super(scope, id);

        //Primero creamos las lambdas. Que son tres.
        const getTodayHistoricalData = new NodejsFunction(this, 'GetTodayHistoricalData', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getTodayHistoricalData.ts')),
            environment: {
                TABLE_NAME: props.stationHistoricalDayDataTable.tableName
            }
        });
        const getMonthHistoricalData = new NodejsFunction(this, 'GetMonthHistoricalData', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getMonthHistoricalData.ts')),
            environment: {
                TABLE_NAME: props.stationHistoricalDayDataTable.tableName
            }
        });
        const getYearHistoricalData = new NodejsFunction(this, 'GetYearHistoricalData', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getYearHistoricalData.ts')),
            environment: {
                TABLE_NAME: props.stationHistoricalDayDataTable.tableName
            }
        });

        //Les damos permisos de lectura sobre las tablas.
        props.stationHistoricalDayDataTable.grantWriteData(getTodayHistoricalData);
        props.stationHistoricalDayDataTable.grantWriteData(getMonthHistoricalData);
        props.stationHistoricalDayDataTable.grantWriteData(getYearHistoricalData);


        //LA API
        const api = new RestApi(this, 'ApiHistoricalDayData', {});

        //Los authorithers
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'HistoricalAuthorizer', {
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
        
        //Ahora creamos los recursos
        const rootResource = api.root;
        const historicalResource = rootResource.addResource('historical');
        const historicalDayResource = historicalResource.addResource('day');
        const historicalMonthResource = historicalResource.addResource('month');
        const historicalYearResource = historicalResource.addResource('year');
        //Esto lo hacemos así porque la estación en forma wunderground envía 
        //una petición get. Que no POST.
        historicalDayResource.addMethod('GET', new LambdaIntegration(getTodayHistoricalData), optionWithauth);
        historicalMonthResource.addMethod('GET', new LambdaIntegration(getMonthHistoricalData), optionWithauth);
        historicalYearResource.addMethod('GET', new LambdaIntegration(getYearHistoricalData), optionWithauth);
    }
}