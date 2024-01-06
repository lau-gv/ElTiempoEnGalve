#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoDBTablesStack } from '../lib/database/DynamoDBTablesStack';
import { ReceiverServiceStack } from '../lib/receiverService/ReceiverServiceStack';
import { UserServiceStack } from '../lib/userStationService/UserServiceStack';
import { DomainStack } from '../lib/domain/domainStack';
import { AuthStack } from '../lib/AuthStack/AuthStak';
import { HistoricalDataStack } from '../lib/historicalData/HistoricalDataStack';
import { MigratorDataStack } from '../lib/migratorData/MigratorDataStack';

const app = new cdk.App();
const databaseStack = new DynamoDBTablesStack(app, 'DynamoDBTableStack');

//const domainStack = new DomainStack(app, 'DomainStack');

const receiverServiceStack = new ReceiverServiceStack(app, 'ReceiverService', {
  stationDataTable: databaseStack.stationDataTable,
  stationTable: databaseStack.stationTable,
  stationHistoricalDayDataTable: databaseStack.stationHistoricalDayDataTable,
});

const authorizerStack = new AuthStack(app, 'AuthStack');

const userServiceStack = new UserServiceStack(app, 'UserStationServiceStack', {
  stationTable: databaseStack.stationTable,
  userPool: authorizerStack.userPool,
});

const apiHistoricalData = new HistoricalDataStack(app, 'HistoricalServiceStack', {
  stationDataTable : databaseStack.stationDataTable,
  stationHistoricalDayDataTable: databaseStack.stationHistoricalDayDataTable,
  userPool: authorizerStack.userPool,
})

const migrator = new MigratorDataStack(app, 'MigratorServiceStack', {
  stationDataTable: databaseStack.stationDataTable,
  stationHistoricalDayDataTable: databaseStack.stationHistoricalDayDataTable,
})



/* No me dejan comprar un dominio para probar la correcta configuración de mi certificado hasta que no haga algo 
que no se qué es exactamente y, como cuesta pasta, no lo voy a arreglar todavía. Pero aquí conste
que generé la cosa usando cdk y fue bonito. Son los wildcards algo más inseguros?
El otro día charrábamos que da pie a falta de control sobre los subdominios. 
const userServiceStackWithDomain = new UserServiceStack(app, 'UserServiceStack', {
  hostedZone: domainStack.hostedZone,
  wildcard: domainStack.wildcardCertificate,
  stationTable: databaseStack.stationTable
});*/