export class MissingFieldError extends Error {
    constructor(missingField: string) {
        super(`Value for ${missingField} expected!`)
    }
}

export class UnexpectedFieldError extends Error {
  constructor(unexpectedField: string) {
      super(`Value for ${unexpectedField} not expected!`)
  }
}


export class JsonError extends Error {}

export function handleError(error : any){
    if (error instanceof MissingFieldError || error instanceof JsonError) {
        return {
          statusCode: 400,
          body: JSON.stringify(`${error.message}`)
        };
      } else {
        return {
            statusCode: 500,
            body: JSON.stringify(`${error.message}`),
            headers: {
                'Content-Type': 'application/json',
            }
        };
      }
}
