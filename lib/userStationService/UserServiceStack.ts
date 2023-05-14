import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiUserStation, ApiUserProps } from "./ApiUserStation";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { ApiUserPropsWithDomain } from "./ApiUserWithDomain";

//interface UserServiceStackPropsWithDomain extends StackProps, ApiUserPropsWithDomain {}

interface UserServiceStackProps extends StackProps, ApiUserProps{}


export class UserServiceStack extends Stack {
    constructor(scope: Construct, id: string, props: UserServiceStackProps) {
        super(scope, id, props);

        
        /*const apiUser = new ApiUserWithDomain(this, "ApiUserWithDomain", {
          hostedZone: props.hostedZone,
          stationTable: props.stationTable,
          wildcard: props.wildcard
        });*/

        const apiUser = new ApiUserStation(this, "UserStationApi", {
          stationTable: props.stationTable,
          userPool: props.userPool,
        })
    }
}