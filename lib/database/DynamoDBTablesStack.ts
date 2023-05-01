import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import {} from "aws-cdk-lib"

const USERTABLE_NAME: string = 'user_table_el_tiempo_en_galve';
const STATION_TABLE_NAME: string  = 'station_table_el_tiempo_en_galve';
const STATION_DATA_TABLE_NAME: string = 'station_data_table_el_tiempo_en_galve';

export class DynamoDBTablesStack extends Stack{
    
    public readonly userTable: Table;
    public readonly stationTable: Table;
    public readonly stationDataTable: Table;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.userTable = new Table(this, USERTABLE_NAME, {
          partitionKey: { name: 'id', type: AttributeType.STRING },
          tableName: USERTABLE_NAME,
          //billingMode: BillingMode.PROVISIONED,
          //billingMode: BillingMode.PAY_PER_REQUEST
          removalPolicy: RemovalPolicy.RETAIN
        });
      
    //Quiero tener índices para la localización y para el usuario (así poder buscar todas las staciones de una localización
    //y todas las estaciones de un usuario) https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/SecondaryIndexes.html
    //Para esto, se usan índices (y la clave de ordenación?);
    //Ahora, si tengo un id muy distinto y una sortkey????? mmmmmm no sería más mejor tener 
    //como partition key  
    //https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html
      /*this.stationTable = new Table(this, `${STATION_TABLE_NAME}`, {
          tableName: STATION_TABLE_NAME,
          partitionKey: { name: 'id', type: AttributeType.STRING },
          sortKey: {name: 'user', type: AttributeType.STRING},
          //billingMode: BillingMode.PROVISIONED,
          //billingMode: BillingMode.PAY_PER_REQUEST,
          removalPolicy: RemovalPolicy.RETAIN
      });*/

      this.stationTable = new Table(this, `${STATION_TABLE_NAME}`, {
        tableName: STATION_TABLE_NAME,
        partitionKey: { name: 'user', type: AttributeType.STRING },
        sortKey: {name: 'id', type: AttributeType.STRING},
        //billingMode: BillingMode.PROVISIONED,
        //billingMode: BillingMode.PAY_PER_REQUEST,
        removalPolicy: RemovalPolicy.RETAIN
    })

      this.stationTable.addLocalSecondaryIndex({
        indexName: 'locationIndex',
        sortKey: {name: 'location', type: AttributeType.STRING},
        projectionType: ProjectionType.ALL
      })

      this.stationTable.addLocalSecondaryIndex({
        indexName: 'authStation',
        sortKey: {name: 'authStation', type: AttributeType.STRING},
        projectionType: ProjectionType.ALL,
    })

      /*
      Al crear un índice secundario, debe especificar los atributos que se proyectarán en el índice. DynamoDB ofrece tres opciones diferentes para esto:
      KEYS_ONLY: cada elemento del índice consta únicamente de los valores de la clave de partición y la clave de ordenación de la tabla, así como de los valores de las claves del índice. La opción KEYS_ONLY da como resultado el índice secundario más pequeño posible.
      INCLUDE: además de los atributos que se describen en KEYS_ONLY, el índice secundario incluirá otros atributos sin clave que se especifiquen.
      ALL: el índice secundario incluye todos los atributos de la tabla de origen. Debido a que todos los datos de la tabla están duplicados en el índice, un resultado de proyección ALL en el índice secundario más grande posible.
      */
  
      this.stationDataTable = new Table(this, `${STATION_DATA_TABLE_NAME}`, {
          partitionKey: { name: 'id', type: AttributeType.STRING },
          sortKey: {name: 'datadatetime', type: AttributeType.STRING},
          tableName: STATION_DATA_TABLE_NAME,
          //billingMode: BillingMode.PROVISIONED,
          //billingMode: BillingMode.PAY_PER_REQUEST
          removalPolicy: RemovalPolicy.RETAIN
        });

        this.userTable.autoScaleWriteCapacity({ minCapacity: 5, maxCapacity: 25 })
          .scaleOnUtilization({targetUtilizationPercent: 90});;
        this.userTable.autoScaleReadCapacity({ minCapacity: 5, maxCapacity: 25 })
          .scaleOnUtilization({targetUtilizationPercent: 90});
        
        this.stationTable.autoScaleWriteCapacity({ minCapacity: 5, maxCapacity: 25 })
          .scaleOnUtilization({targetUtilizationPercent: 90});
        this.stationTable.autoScaleReadCapacity({ minCapacity: 5, maxCapacity: 25 })
          .scaleOnUtilization({targetUtilizationPercent: 90});
        
        this.stationDataTable.autoScaleWriteCapacity({ minCapacity: 5, maxCapacity: 25 })
          .scaleOnUtilization({targetUtilizationPercent: 90});
        this.stationDataTable.autoScaleReadCapacity({ minCapacity: 5, maxCapacity: 25 })
          .scaleOnUtilization({targetUtilizationPercent: 90});       
    }
}