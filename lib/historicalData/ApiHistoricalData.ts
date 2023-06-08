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
        const getTodayHistoricalDataDay = new NodejsFunction(this, 'GetTodayHistoricalDataDay', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: "GetTodayHistoricalDataDay-ServiceApi",
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getTodayHistoricalDataDay.ts')),
            environment: {
                TABLE_NAME: props.stationHistoricalDayDataTable.tableName
            }
        });
        const getMonthHistoricalDataDay = new NodejsFunction(this, 'GetMonthHistoricalData', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: "GetMonthHistoricalDataDay-ServiceApi",
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getMonthHistoricalDataDay.ts')),
            environment: {
                TABLE_NAME: props.stationHistoricalDayDataTable.tableName
            }
        });
        const getYearHistoricalDataDay = new NodejsFunction(this, 'GetYearHistoricalData', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: "GetYearHistoricalDataDay-ServiceApi",
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getYearHistoricalDataDay.ts')),
            environment: {
                TABLE_NAME: props.stationHistoricalDayDataTable.tableName
            }
        });
        const getBetweenHistoricalDataDay = new NodejsFunction(this, 'GetBetweenHistoricalDataDay', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: "GetBetweenHistoricalDataDay-ServiceApi",
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getHistoricalDataDayBetween.ts')),
            environment: {
                TABLE_NAME: props.stationHistoricalDayDataTable.tableName
            }
        });

        //Les damos permisos de lectura sobre las tablas.
        props.stationHistoricalDayDataTable.grantReadData(getTodayHistoricalDataDay);
        props.stationHistoricalDayDataTable.grantReadData(getMonthHistoricalDataDay);
        props.stationHistoricalDayDataTable.grantReadData(getYearHistoricalDataDay);
        props.stationHistoricalDayDataTable.grantReadData(getBetweenHistoricalDataDay);


        //LA API
        const api = new RestApi(this, 'ApiHistoricalData', {});

        //Los authorithers
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'HistoricalDataAuthorizer', {
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
        const historicalResource = rootResource.addResource('dayHistorical');
        const historicalDayResource = historicalResource.addResource('day');
        const historicalMonthResource = historicalResource.addResource('month');
        const historicalBetweenResource = historicalResource.addResource('between');

        const historicalMonth = rootResource.addResource('monthHistorical');
        const historicalYearResource = historicalMonth.addResource('year');
        //Esto lo hacemos así porque la estación en forma wunderground envía 
        //una petición get. Que no POST.
        historicalDayResource.addMethod('GET', new LambdaIntegration(getTodayHistoricalDataDay), optionWithauth);
        historicalMonthResource.addMethod('GET', new LambdaIntegration(getMonthHistoricalDataDay), optionWithauth);
        historicalYearResource.addMethod('GET', new LambdaIntegration(getYearHistoricalDataDay), optionWithauth);
        historicalBetweenResource.addMethod('GET', new LambdaIntegration(getBetweenHistoricalDataDay), optionWithauth);
    }
}