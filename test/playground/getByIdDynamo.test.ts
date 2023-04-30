import { handler } from '../../../../ProyectoDeDesarrolloDeAplicacionesMultimedia/ElTiempoEnGalvePruebas3/services/InsertDataStation/receiverLambda';

const event = {
    
    body: {
        location: 'Prueba'
    }
}

handler(event as any, {} as any);