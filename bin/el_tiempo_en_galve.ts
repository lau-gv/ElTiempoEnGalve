#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoDBTablesStack } from '../lib/database/DynamoDBTablesStack';
import { ReceiverServiceStack } from '../lib/receiverService/ReceiverServiceStack';
import { UserServiceStack } from '../lib/userStationService/UserServiceStack';
import { DomainStack } from '../lib/domain/domainStack';
import { AuthStack } from '../lib/AuthStack/AuthStak';
import { HistoricalDataStack } from '../lib/historicalData/HistoricalDataStack';

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

const apiHistoricalData = new HistoricalDataStack(app, 'TodayHistoricalServiceStack', {
  stationHistoricalDayDataTable: databaseStack.stationHistoricalDayDataTable,
  userPool: authorizerStack.userPool,
})

/* No me dejan comprar un dominio para probar la correcta configuración de mi certificado hasta que no haga algo 
const userServiceStackWithDomain = new UserServiceStack(app, 'UserServiceStack', {
  hostedZone: domainStack.hostedZone,
  wildcard: domainStack.wildcardCertificate,
  stationTable: databaseStack.stationTable
});*/