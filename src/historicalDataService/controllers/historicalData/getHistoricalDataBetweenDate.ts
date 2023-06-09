import { APIGatewayProxyEvent } from "aws-lambda";
import { IncompleteBodyError } from "../../../common/utils/Validator";
import { getHistoricalDataDayBetween } from "../../../common/services/repository/HistoricalDataRepository/DynamoHistoricalDayData";


export async function getHistoricalDataBetweenCommon(event: APIGatewayProxyEvent, tableName : string,
  validateData: (event: APIGatewayProxyEvent) => void, 
  startDateFunction: (receivedatadate: string) => string,
  endDateFunction: (receivedatadate: string) => string,
  ) : Promise <HistoricalDataDay[] | undefined>{

      if(!event.queryStringParameters){
        throw new IncompleteBodyError();
      }     

      validateData(event);
      
      const stationId = event.queryStringParameters['stationId']!;
      const datadate = event.queryStringParameters['datadate']!;
      const startDatadate = startDateFunction(datadate);
      const endDatadate = endDateFunction(datadate);
      const historicalDatasDay = await getHistoricalDataDayBetween(tableName, stationId!, startDatadate, endDatadate);
      
      return historicalDatasDay;    
    
}


