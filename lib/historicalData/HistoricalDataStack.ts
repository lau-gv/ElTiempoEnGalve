import { Stack, StackProps } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { ApiHistoricalData, ApiHistoricalDataProps } from "./ApiHistoricalData";


interface HistoricalDataStackProps extends StackProps, ApiHistoricalDataProps{}
  
  export class HistoricalDataStack extends Stack {
    constructor(scope: Construct, id: string, props: HistoricalDataStackProps) {
        super(scope, id, props);

        //Aquí creamos nuestros constructores.
        //Primero el api Receiver.
        const apiHistoricalDayData = new ApiHistoricalData(this, 'ApiHistoricalDayData', {
            stationHistoricalDayDataTable: props.stationHistoricalDayDataTable,
            userPool: props.userPool,
          })
    }
}