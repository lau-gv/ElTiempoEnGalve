import { twoDecimals } from "../../../common/utils/utils";

export class EcowittStation implements WeatherStation{
    
    public readonly receiveIdentifier: string;

    constructor(receiveIdentifier: string){
        this.receiveIdentifier = receiveIdentifier;
    }

    getAuth() {
        return this.receiveIdentifier;
    }

    formatData(stationId: string, parsedData: any) {
        const data : StationData = {
            stationId: stationId,
            datadatetime: parsedData.spainTime,
            authStation: this.getAuth(),
            temperature: twoDecimals((parseFloat(parsedData.tempf) - 32) * 5/9),
            humidity:  parsedData.humidity,
            baromrelhpa: twoDecimals(parseFloat(parsedData.baromrelin)* 33.86388640341),  
            baromabshpa: twoDecimals(parseFloat(parsedData.baromabsin)* 33.86388640341), 
            rainrateinmm: twoDecimals(parseFloat(parsedData.rainratein) * 25.4), 
            eventraininmm : twoDecimals(parseFloat(parsedData.eventrainin)* 25.4) , 
            hourlyraininmm: twoDecimals(parseFloat(parsedData.hourlyrainin)* 25.4),
            dailyraininmm: twoDecimals(parseFloat(parsedData.dailyrainin)* 25.4),
            weeklyraininmm: twoDecimals(parseFloat(parsedData.weeklyrainin )* 25.4),
            monthlyraininmm: twoDecimals(parseFloat(parsedData.monthlyrainin)* 25.4),
            yearlyraininmm: twoDecimals(parseFloat(parsedData.yearlyrainin)* 25.4),
            winddir: parseFloat(parsedData.winddir), 
            windspeedkmh: twoDecimals(parseFloat(parsedData.windspeedmph) * 1.60934), 
            windguskmh: twoDecimals(parseFloat(parsedData.windgustmph) * 1.60934), 
            maxdailygust: twoDecimals(parseFloat(parsedData.maxdailygust) * 1.60934), 
            solarradiation: parsedData.solarradiation, 
            uv:  parsedData.uv, 
            lowbatt: parsedData.wh65batt, 
            freq: parsedData.freq,
            model: parsedData.model, 
            interval: parsedData.interval,
            //Datos de dentro:tempinf
            indoortempf: twoDecimals((parseFloat(parsedData.tempinf) - 32) * 5/9),
            indoorhumidity: parsedData.humidityin
            
        }  
        return data;
    }
}