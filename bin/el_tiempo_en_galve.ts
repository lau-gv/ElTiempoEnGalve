#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoDBTablesStack } from '../lib/database/DynamoDBTablesStack';
import { ReceiverServiceStack } from '../lib/receiverService/ReceiverServiceStack';
import { UserServiceStack } from '../lib/userService/UserServiceStack';
import { DomainStack } from '../lib/domain/domainStack';

const app = new cdk.App();
const databaseStack = new DynamoDBTablesStack(app, 'DynamoDBTableStack');

const domainStack = new DomainStack(app, 'DomainStack');

const receiverServiceStack = new ReceiverServiceStack(app, 'ReceiverService', {
  stationDataTable: databaseStack.stationDataTable,
  stationTable: databaseStack.stationTable
});

const userServiceStack = new UserServiceStack(app, 'UserServiceStack');