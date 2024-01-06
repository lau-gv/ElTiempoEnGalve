import { ApiKey, ApiKeySourceType, AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi, UsagePlan } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Construct } from "constructs"
import { join } from "path";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { CfnOutput } from "aws-cdk-lib";

export interface ApiHistoricalDataProps {
    stationDataTable: Table;
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

        const getStationBetweenData = new NodejsFunction(this, 'GetStationBetweenData', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: "GetStationHistoricalDataBetween-ServiceApi",
            entry: (join(__dirname, '..','..',  'src', 'historicalDataService', 'lambdas', 'getBetweenStationData.ts')),
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
        props.stationDataTable.grantReadData(getStationBetweenData);


        //LA API
        const api = new RestApi(this, 'ApiHistoricalData', {
            apiKeySourceType: ApiKeySourceType.HEADER
        }, );

        //Queremos que las peticiones a la api usen key....
        const apiKey = new ApiKey(this, 'ApiKeyHistoricalData')
        
        const usagePlan = new UsagePlan(this, 'UsagePlan', {
            name: 'Usage Plan',
            apiStages: [
              {
                api,
                stage: api.deploymentStage,
              },
            ],
          })

        usagePlan.addApiKey(apiKey);
          
        //Ahora creamos los recursos
        const rootResource = api.root;
        const historicalResource = rootResource.addResource('dayHistorical');
        const historicalDayResource = historicalResource.addResource('day');
        const historicalMonthResource = historicalResource.addResource('month');
        const historicalBetweenResource = historicalResource.addResource('between');

        const historicalMonth = rootResource.addResource('monthHistorical');
        const historicalYearResource = historicalMonth.addResource('year');

        const todayData = rootResource.addResource('currentData');
        const stationHistoricalData = rootResource.addResource('stationHistorical');
        const betweenStationHistorical = stationHistoricalData.addResource('between');

        historicalDayResource.addMethod('GET', new LambdaIntegration(getTodayHistoricalDataDay), {apiKeyRequired: true,});
        historicalMonthResource.addMethod('GET', new LambdaIntegration(getMonthHistoricalDataDay), {apiKeyRequired: true,});
        historicalBetweenResource.addMethod('GET', new LambdaIntegration(getBetweenHistoricalDataDay), {apiKeyRequired: true,});
        
        historicalYearResource.addMethod('GET', new LambdaIntegration(getYearHistoricalDataDay), {apiKeyRequired: true,});

        todayData.addMethod('GET', new LambdaIntegration(getCurrentData), {apiKeyRequired: true,});
        betweenStationHistorical.addMethod('GET', new LambdaIntegration(getStationBetweenData), {apiKeyRequired: true,});

        new CfnOutput(this, 'API Key historical data ID', {
            value: apiKey.keyId,
          });
    }
}