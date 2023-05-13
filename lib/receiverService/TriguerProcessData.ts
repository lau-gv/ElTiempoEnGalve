
import { Construct } from "constructs"
import { Chain, Map, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Effect, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { CfnPipe } from "aws-cdk-lib/aws-pipes";



//Este constructor colabora con el StackDeBase de datos. Necesita conocerlo en tanto que 
//se van a acceder a estas dos tablas.
interface TriguerProcessDataProps {
    queue: Queue;
    stateMachine: StateMachine;
}
  

export class TriguerProcessdata extends Construct {

    public readonly stateMachine : StateMachine;

    constructor(scope: Construct, id: string, props: TriguerProcessDataProps){
        super(scope, id);

       //Primero, necesitamos crear políticas de IAM para permitir a nuestras pipes acceder a la info.
       const sourcePolicy = new PolicyStatement({
        resources: [props.queue.queueArn],
        actions: [
        'sqs:ReceiveMessage',
        'sqs:DeleteMessage',
        'sqs:GetQueueAttributes', 
      ],
      effect: Effect.ALLOW,
      });

      //Permite la ejecución de nuestro stepFunctions.
      const targetPolicy = new PolicyStatement({
        resources: [props.stateMachine.stateMachineArn],
        actions: ['states:StartExecution'],
        effect: Effect.ALLOW,
      });

      //Y finalmente, debemos crear un rol que utilizará nuestro pipe.
      /*El servicio que se debe utilizar en el AssumedBy depende del servicio de AWS que se esté utilizando. En el caso del ejemplo que vimos, se está utilizando AWS Pipes, por lo que se utiliza el valor 'pipes.amazonaws.com'.*/
      const pipeRole = new Role(this, 'PipeRole', {
        assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
      });
      
      pipeRole.addToPolicy(sourcePolicy);
      pipeRole.addToPolicy(targetPolicy);
    
      //Ahora debemos crear nuestro pipe! Solo se puede con constructor L1. Por eso hemos tenido que crear tanta morralla de roles.
      //https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_pipes-readme.html Aquí nos lo confirma la documentación.
  
      const pipe = new CfnPipe(this, 'Pipe', {
        roleArn: pipeRole.roleArn,
        source: props.queue.queueArn,
        sourceParameters: {
          sqsQueueParameters: {
            batchSize: 5,
            maximumBatchingWindowInSeconds: 10
          }
        },
        target: props.stateMachine.stateMachineArn,
        targetParameters: {
          stepFunctionStateMachineParameters: {
            invocationType: 'FIRE_AND_FORGET',
              //Por lo tanto, al utilizar "FIRE_AND_FORGET" en el contexto del código que se presenta, se está especificando que no se espera una respuesta de la máquina de estados, sino simplemente se quiere lanzar un evento para que la máquina de estados procese su trabajo sin que haya una sincronización en la respuesta.

          },
        },
      });
    }
}