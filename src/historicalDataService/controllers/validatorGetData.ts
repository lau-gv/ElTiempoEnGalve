import { APIGatewayProxyEvent } from "aws-lambda";
import { MissingFieldError, UnexpectedFieldError } from "../../common/utils/Validator";


export function validateAsGetPeticion(event: APIGatewayProxyEvent) {
  const allowedFields = ['stationId', 'month'];
    const dataDateRegex = /^\d{1}$/;
  
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
  
    if (!arg.datadate || !dataDateRegex.test(arg.datadate)) {
      throw new MissingFieldError('month');
    }
  }