#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoDBTablesStack } from '../lib/database/DynamoDBTablesStack';
import { ReceiverServiceStack } from '../lib/receiverService/ReceiverServiceStack';

const app = new cdk.App();
const databaseStack = new DynamoDBTablesStack(app, 'DynamoDBTableStack');


const receiverServiceStack = new ReceiverServiceStack(app, 'ReceiverService', {
  stationDataTable: databaseStack.stationDataTable,
  stationTable: databaseStack.stationTable
});