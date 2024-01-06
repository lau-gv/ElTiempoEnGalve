import { Stack, StackProps } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { ApiMigratorDataProps, MigratorDataApi } from "./MigratorDataApi";




interface MigratorDataStackProps extends StackProps, ApiMigratorDataProps{}
  
  export class MigratorDataStack extends Stack {
    constructor(scope: Construct, id: string, props: MigratorDataStackProps) {
        super(scope, id, props);

        //Aquí creamos nuestros constructores.
        //Primero el api Receiver.
        const apiHistoricalDayData = new MigratorDataApi(this, 'ApiMigratorData', {
            stationDataTable : props.stationDataTable,
            stationHistoricalDayDataTable: props.stationHistoricalDayDataTable,
          })
    }
}