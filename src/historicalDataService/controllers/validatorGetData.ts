import { APIGatewayProxyEvent } from "aws-lambda";
import { MissingFieldError, UnexpectedFieldError } from "../../common/utils/Validator";


export function validateAsGetPeticion(event: APIGatewayProxyEvent) {
    const allowedFields = ['stationId', 'datadate', 'key'];
    const dataDateRegex = /^\d{8}$/;
  
    const arg = event.queryStringParameters;
  
    if (!arg) {
      throw new Error('No se encontraron parámetros en la solicitud');
    }
  
    for (const field in arg) {
      if (!allowedFields.includes(field)) {
        throw new Error(`Campo inesperado: ${field}`);
      }
    }
  
    if (!arg.stationId) {
      throw new Error('Falta el campo requerido: stationId');
    }
  
    if (!arg.datadate || !dataDateRegex.test(arg.datadate)) {
      throw new Error('Falta el campo requerido o no cumple con el formato requerido: datadate');
    }
  }