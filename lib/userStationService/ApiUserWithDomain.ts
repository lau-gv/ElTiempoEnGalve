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
//ESTA CLASE NO SE USA PERO LA MANTENGO AQUÍ PORQUE ES UN EJEMPLO.
export interface ApiUserPropsWithDomain {
    wildcard: Certificate,
    hostedZone : HostedZone;
    stationTable: Table;
    userPool : IUserPool;
}


export class ApiUser extends Construct {

    constructor(scope: Construct, id: string, props : ApiUserPropsWithDomain){
        super(scope, id);

        //Creamos las Lambdas:
        const createStation = new NodejsFunction(this, 'CreateStationLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userService', 'lambdas', 'createStationLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        const deleteStation = new NodejsFunction(this, 'DeleteStationLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userService', 'lambdas', 'deleteStationLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        const getUserStations = new NodejsFunction(this, 'UserService', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..',  'src', 'userService', 'lambdas', 'getUserStationsLambda.ts')),
            environment: {
                TABLE_NAME: props.stationTable.tableName
            }
        });

        //Permisos sobre la tabla
        props.stationTable.grantReadData(getUserStations);
        props.stationTable.grantWriteData(createStation);
        props.stationTable.grantWriteData(deleteStation);

        //Creamos la api con dominio.
        const api = new ApiWithDomain(this, 'ApiWithDomainUser', {
            apiId: 'UserApi',
            ARecordId: 'UserApiRecord',
            domain: USER_SUB_DOMAIN,
            hostedZone : props.hostedZone,
            wildcard: props.wildcard
        }).api;

        //Creamos el autorizador COGNITO
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'UserApiAuthorizer', {
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

        //Asociamos una lambda a cada método para el recurso creado y le añadimos la autorización.
        //Que no se nos olvide añadir el auth!!
        stationResource.addMethod('POST', new LambdaIntegration(createStation), optionWithauth);
        stationResource.addMethod('DELETE', new LambdaIntegration(deleteStation), optionWithauth);
        stationResource.addMethod('GET', new LambdaIntegration(getUserStations), optionWithauth);
    }
}