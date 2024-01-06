import { APIGatewayProxyEvent } from "aws-lambda";
import { IncompleteBodyError, MissingFieldError, UnexpectedFieldError, handleError } from "../../../common/utils/Validator";
import { getStationDataBetween } from "../../../common/services/repository/EstacionRepository/DynamoDataStationDB";




export async function getBetweenStationDataController(event: APIGatewayProxyEvent, tableName : string){
  
  try{
    
    validateData(event);

    const startDatadate = event.queryStringParameters!['startDayTime']!;;
    const endDatadate = event.queryStringParameters!['endDayTime']!;
    const stationId = event.queryStringParameters!['stationId']!;
    const historicalDatasDay = await getStationDataBetween(tableName, stationId!, startDatadate, endDatadate);

    return {
      statusCode: 200, 
      body: JSON.stringify((historicalDatasDay)),
      headers: {
          'Content-Type': 'application/json',
      }
  };

  }catch(error : any){
    return handleError(error);
  }
}


function validateData(event: APIGatewayProxyEvent) {
  const allowedFields = ['stationId', 'startDayTime', 'endDayTime' ];
  //Se espera YYYYMMDDHHMMSS año y mes.
  const dataDateRegex = /^\d{14}$/;

  const arg = event.queryStringParameters;

  if (!arg) {
    throw new Error('No se encontraron parámetros en la solicitud');
  }

  for (const field in arg) {
    if (!allowedFields.includes(field)) {
      throw new UnexpectedFieldError(`${field}`);
    }
  }

  if (!arg.stationId) {
    throw new MissingFieldError('stationId');
  }

  if (!arg.startDayTime || !dataDateRegex.test(arg.startDayTime)) {
    throw new MissingFieldError('startDayTime');
  }

  if (!arg.endDayTime || !dataDateRegex.test(arg.endDayTime)) {
    throw new MissingFieldError('endDayTime');
  }
}

