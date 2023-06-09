
async function calcularValores(objetos: HistoricalDataDay[]): Promise<Map<number, HistoricalDataDay>> {
  const result = await Promise.all(
    objetos.map(async (obj) => {
      const {
        datadate,
        stationId,
        year,
        month,
        day,
        maxTemperature,
        minTemperature,
        maxHumidity, 
        minHumidity, 
        maxBaromrelhpa,
        minBaromrelhpa,
        maxBaromabshpa,
        minBaromabshpa,
        maxRainrateinmm,
        minRainrateinmm,
        acumulateDailyraininmm,
        maxdailygust,
        maxSolarradiation,
        minSolarradiation,
        maxUv,
        minUv,
        //Datos de dentro:
        maxIndoortemp,
        minIndoortemp,
        maxIndoorhumidity, 
        minIndoorhumidity,
      } = obj;
      
      return {
        datadate,
        stationId,
        year,
        month,
        day,
        maxTemperature,
        minTemperature,
        maxHumidity, 
        minHumidity, 
        maxBaromrelhpa,
        minBaromrelhpa,
        maxBaromabshpa,
        minBaromabshpa,
        maxRainrateinmm,
        minRainrateinmm,
        acumulateDailyraininmm,
        maxdailygust,
        maxSolarradiation,
        minSolarradiation,
        maxUv,
        minUv,
        //Datos de dentro:
        maxIndoortemp,
        minIndoortemp,
        maxIndoorhumidity, 
        minIndoorhumidity,
      };
    })
  );
  
  return result.reduce((map, obj) => {
    const {
        datadate,
        stationId,
        year,
        month,
        day,
        maxTemperature,
        minTemperature,
        maxHumidity, 
        minHumidity, 
        maxBaromrelhpa,
        minBaromrelhpa,
        maxBaromabshpa,
        minBaromabshpa,
        maxRainrateinmm,
        minRainrateinmm,
        acumulateDailyraininmm,
        maxdailygust,
        maxSolarradiation,
        minSolarradiation,
        maxUv,
        minUv,
        //Datos de dentro:
        maxIndoortemp,
        minIndoortemp,
        maxIndoorhumidity, 
        minIndoorhumidity,
    } = obj;
    
    if (!map.has(month)) {
      map.set(month, {
        datadate,
        stationId,
        year,
        month,
        day,
        maxTemperature,
        minTemperature,
        maxHumidity, 
        minHumidity, 
        maxBaromrelhpa,
        minBaromrelhpa,
        maxBaromabshpa,
        minBaromabshpa,
        maxRainrateinmm,
        minRainrateinmm,
        acumulateDailyraininmm,
        maxdailygust,
        maxSolarradiation,
        minSolarradiation,
        maxUv,
        minUv,
        //Datos de dentro:
        maxIndoortemp,
        minIndoortemp,
        maxIndoorhumidity, 
        minIndoorhumidity,
      });
    } else {
      const existingObj = map.get(month);
      if (existingObj) {
        existingObj.maxTemperature = Math.min(existingObj.maxTemperature, maxTemperature);
        existingObj.minTemperature = Math.min(existingObj.minTemperature, minTemperature);
        existingObj.maxHumidity = Math.min(existingObj.maxHumidity, maxHumidity);
        existingObj.maxHumidity = Math.min(existingObj.maxHumidity, minHumidity);
        existingObj.maxTemperature = Math.min(existingObj.maxTemperature, maxTemperature);
        existingObj.maxTemperature = Math.min(existingObj.maxTemperature, maxTemperature);
        existingObj.maxTemperature = Math.min(existingObj.maxTemperature, maxTemperature);
        existingObj.maxTemperature = Math.min(existingObj.maxTemperature, maxTemperature);
        existingObj.maxTemperature = Math.min(existingObj.maxTemperature, maxTemperature);
      }
    }
    
    return map;
  }, new Map<number, HistoricalDataDay>());
}

/*
/p`'''''''''''''''''/ Ejemplo de uso
try{
    const objetos: HistoricalDataDay[] = 

    calcularValores(objetos).then((resultado) => {
      console.log(resultado);
    }).catch((error) => {
      console.error(error);
    });
}*/

