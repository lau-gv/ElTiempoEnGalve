import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Construct } from "constructs"
import { join } from "path";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { IUserPool } from "aws-cdk-lib/aws-cognito";

export interface ApiHistoricalDataPropsWithCognito {
    stationDataTable: Table;
    stationHistoricalDayDataTable: Table;
    userPool : IUserPool;

  }

export class ApiHistoricalDataWithCognito extends Construct {

    constructor(scope: Construct, id: string, props: ApiHistoricalDataPropsWithCognito){
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
        const getBetweenHistoricalDataDay = new NodejsFunction(this, 'GetBetweenHistoricalDataDay', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: "GetBetweenHistoricalDataDay-ServiceApi",
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getHistoricalDataDayBetween.ts')),
            environment: {
                TABLE_NAME: props.stationHistoricalDayDataTable.tableName
            }
        });

        const getYearHistoricalDataDay = new NodejsFunction(this, 'GetYearHistoricalData', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: "GetYearHistoricalDataYear-ServiceApi",
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getYearHistoricalDataDay.ts')),
            environment: {
                TABLE_NAME: props.stationHistoricalDayDataTable.tableName
            }
        });
        const getCurrentData = new NodejsFunction(this, 'GetCurrentData', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: "GetCurrentDataCurrentHistorical-ServiceApi",
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getCurrentDataLambda.ts')),
            environment: {
                TABLE_NAME: props.stationDataTable.tableName
            }
        });

        //Les damos permisos de lectura sobre las tablas.
        props.stationHistoricalDayDataTable.grantReadData(getTodayHistoricalDataDay);
        props.stationHistoricalDayDataTable.grantReadData(getMonthHistoricalDataDay);
        props.stationHistoricalDayDataTable.grantReadData(getBetweenHistoricalDataDay);
        props.stationHistoricalDayDataTable.grantReadData(getYearHistoricalDataDay);
        
        props.stationDataTable.grantReadData(getCurrentData);


        //LA API
        const api = new RestApi(this, 'ApiHistoricalData', {});

        //Los authorithers
        /*const authorizer = new CognitoUserPoolsAuthorizer(this, 'HistoricalDataAuthorizer', {
            cognitoUserPools:[props.userPool],
            identitySource: 'method.request.header.Authorization'
        });

        authorizer._attachToApi(api);*/
        /*
        const optionWithauth : MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }*/
        
        //Ahora creamos los recursos
        const rootResource = api.root;
        const historicalResource = rootResource.addResource('dayHistorical');
        const historicalDayResource = historicalResource.addResource('day');
        const historicalMonthResource = historicalResource.addResource('month');
        const historicalBetweenResource = historicalResource.addResource('between');

        const historicalMonth = rootResource.addResource('monthHistorical');
        const historicalYearResource = historicalMonth.addResource('year');

        const todayData = rootResource.addResource('currentData');

        historicalDayResource.addMethod('GET', new LambdaIntegration(getTodayHistoricalDataDay));
        historicalMonthResource.addMethod('GET', new LambdaIntegration(getMonthHistoricalDataDay));
        historicalBetweenResource.addMethod('GET', new LambdaIntegration(getBetweenHistoricalDataDay));
        
        historicalYearResource.addMethod('GET', new LambdaIntegration(getYearHistoricalDataDay));

        todayData.addMethod('GET', new LambdaIntegration(getCurrentData));
        //CON AUTENTICACION DE COGNITO
        //historicalDayResource.addMethod('GET', new LambdaIntegration(getTodayHistoricalDataDay), optionWithauth);
        //historicalMonthResource.addMethod('GET', new LambdaIntegration(getMonthHistoricalDataDay), optionWithauth);
        //historicalBetweenResource.addMethod('GET', new LambdaIntegration(getBetweenHistoricalDataDay), optionWithauth);
        //
        //historicalYearResource.addMethod('GET', new LambdaIntegration(getYearHistoricalDataDay), optionWithauth);
        //
        //todayData.addMethod('GET', new LambdaIntegration(getCurrentData), optionWithauth);
        
    }
}