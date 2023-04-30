import {getTimeInSpain } from "../../src/receiverService/controller/ReceiverLambdaController"

const event = {
    
    body: {
        location: 'Prueba'
    }
}



console.log(getTimeInSpain());