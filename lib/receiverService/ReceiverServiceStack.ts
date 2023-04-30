import { Stack, StackProps } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { ApiReceiver } from "./ApiReceiver";
import { ProcessReceiverData } from "./ProcessReceiverData";
import { TriguerProcessdata } from "./TriguerProcessData";


interface ReceiverServiceStackProps extends StackProps {
    stationTable: Table;
    stationDataTable: Table;
  }
  
  export class ReceiverServiceStack extends Stack {
    constructor(scope: Construct, id: string, props: ReceiverServiceStackProps) {
        super(scope, id, props);

        //Aquí creamos nuestros constructores.
        //Primero el api Receiver.
        const apiReceiver : ApiReceiver = new ApiReceiver(this, 'ApiReceiverService');
        const processReceiverdata : ProcessReceiverData = new ProcessReceiverData(this, 'processReceiverData', {
            stationDataTable: props.stationDataTable,
            stationTable: props.stationTable
        })
        const triguerProcessdata : TriguerProcessdata = new TriguerProcessdata(this, 'triguerProcessdata', {
            queue: apiReceiver.queue,
            stateMachine: processReceiverdata.stateMachine
        })
    }
}