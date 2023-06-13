import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Construct } from "constructs"
import { join } from "path";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export interface ApiMigratorDataProps {
    stationDataTable: Table;
    stationHistoricalDayDataTable: Table;
  }

export class MigratorDataApi extends Construct {



    constructor(scope: Construct, id: string, props: ApiMigratorDataProps){
        super(scope, id);

        //Primero creamos las lambdas. Que son tres.
        const migratorFunction = new NodejsFunction(this, 'MigratorFunction', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: "MigratorFunction-ServiceApi",
            entry: (join(__dirname, '..','..',  'src', 'migratorService', 'migratorLambda.ts')),
            environment: {
                TABLE_NAME: props.stationDataTable.tableName,
                TABLE_NAME2: props.stationHistoricalDayDataTable.tableName
            }
        });
        
        //Les damos permisos de lectura sobre las tablas.
        props.stationHistoricalDayDataTable.grantReadWriteData(migratorFunction);
        props.stationDataTable.grantReadWriteData(migratorFunction);


        //LA API
        const api = new RestApi(this, 'ApiMigrator', {});


        
        //Ahora creamos los recursos
        const rootResource = api.root;
        const migratorResource = rootResource.addResource('migrator');



        migratorResource.addMethod('POST', new LambdaIntegration(migratorFunction));        
    }
}