
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Construct } from "constructs"
import { join } from "path";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import * as task from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Chain, Choice, Condition, Map, Parallel, StateMachine, Succeed } from 'aws-cdk-lib/aws-stepfunctions';



//Este constructor colabora con el StackDeBase de datos. Necesita conocerlo en tanto que 
//se van a acceder a estas dos tablas.
interface ProcessReceiverDataProps {
    stationTable: Table;
    stationDataTable: Table;
    stationHistoricalDayDataTable: Table;
}
  

export class ProcessReceiverData extends Construct {

    public readonly stateMachine : StateMachine;

    constructor(scope: Construct, id: string, props: ProcessReceiverDataProps){
      super(scope, id);

      const authorizeStationLambda = new NodejsFunction(scope, 'AuthorizeStationLambda', {
          runtime: Runtime.NODEJS_18_X,
          handler: 'handler',
          entry: (join(__dirname, '..','..', 'src', 'receiverService', 'lambdas', 'AuthorizeStationLambda.ts')),
          environment: {
            TABLE_NAME: props.stationTable.tableName,
            }
        });

      const insertStationDataLambda = new NodejsFunction(scope, 'InsertStationDataLambda', {
          runtime: Runtime.NODEJS_18_X,
          handler: 'handler',
          entry: (join(__dirname, '..','..', 'src', 'receiverService', 'lambdas', 'InsertDataLambda.ts')),
          environment: {
            TABLE_NAME: props.stationDataTable.tableName,
          }
        });

        
      const updateHistoricalDataDay = new NodejsFunction(scope, 'UpdateHistoricalDataDay', {
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        entry: (join(__dirname, '..','..', 'src', 'receiverService', 'lambdas', 'UpdateHistoricalDataDayLambda.ts')),
        environment: {
          TABLE_NAME: props.stationHistoricalDayDataTable.tableName,
        }
      });

      //Permisos de escritura sobre DYNAMO
      props.stationTable.grantReadData(authorizeStationLambda);
      props.stationDataTable.grantWriteData(insertStationDataLambda);
      props.stationHistoricalDayDataTable.grantReadWriteData(updateHistoricalDataDay);

      //Preparamos las Lambdas para poder meterlas en StepFunctions.
      const authorizeStationTask = new task.LambdaInvoke(scope, 'ReceiverServiceStepfunctions', {
          lambdaFunction: authorizeStationLambda,
          inputPath: '$',
          resultPath: '$.authorizationResult',
        });
    
      const insertDataStationTask = new task.LambdaInvoke(this, 'InsertDataStationSetpfunctionsTask', {
        lambdaFunction: insertStationDataLambda,
        inputPath: '$.authorizationResult',
        resultPath: '$.insertDataResult',
      });

      const notifyDataTask = new task.LambdaInvoke(this, 'UpdateHistoricalDataDay', {
        lambdaFunction: updateHistoricalDataDay,
        inputPath: '$.authorizationResult',
        resultPath: '$.notifyResult',
      });

      const successState = new Succeed(this, 'notAuthorized');

      const parallel = new Parallel(this, 'postSucessParallel')
        .branch(insertDataStationTask)
        .branch(notifyDataTask);

      const condition = new Choice(scope, 'isAuthorized')
        .when(Condition.stringEquals('$.authorizationResult.Payload.authorization', "true"), parallel)
        .otherwise(successState);

      //Y generamos una secuencia.
      const sequence = Chain
      .start(authorizeStationTask)
      .next(condition);
      

      
      //StepFuncions va a leer de una cola. Por lo que debe mapear los objetos de la cola.
      const mapState = new Map(this, 'ReceiverLoopsMessagesFromQueue', {
        itemsPath: '$',
      });
      //e iterar sobre ellos.
      mapState.iterator(sequence);

      this.stateMachine = new StateMachine(scope, 'ReceiverserviceStateMachine', {
        definition: mapState
      });

    }
}