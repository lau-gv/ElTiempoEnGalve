export function getTimeInSpain(): string {

    const horaActual = new Date().toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
    }).replace(/:|\s/g, '');
    const fechaActual = new Date().toLocaleDateString('es-ES').replace(/\/|\.|\s/g, '');
    return `${fechaActual}${horaActual}`;
}