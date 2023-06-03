import { TwoDecimals } from "../../../common/utils/utils";

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
            temperature: TwoDecimals((parseFloat(parsedData.tempf) - 32) * 5/9),
            humidity:  parsedData.humidity,
            baromrelhpa: TwoDecimals(parseFloat(parsedData.baromrelin)* 33.86388640341),  
            baromabshpa: TwoDecimals(parseFloat(parsedData.baromabsin)* 33.86388640341), 
            rainrateinmm: TwoDecimals(parseFloat(parsedData.rainratein) * 25.4), 
            eventraininmm : TwoDecimals(parseFloat(parsedData.eventrainin)* 25.4) , 
            hourlyraininmm: TwoDecimals(parseFloat(parsedData.hourlyrainin)* 25.4),
            dailyraininmm: TwoDecimals(parseFloat(parsedData.dailyrainin)* 25.4),
            weeklyraininmm: TwoDecimals(parseFloat(parsedData.weeklyrainin )* 25.4),
            monthlyraininmm: TwoDecimals(parseFloat(parsedData.monthlyrainin)* 25.4),
            yearlyraininmm: TwoDecimals(parseFloat(parsedData.yearlyrainin)* 25.4),
            winddir: parseFloat(parsedData.winddir), 
            windspeedkmh: TwoDecimals(parseFloat(parsedData.windspeedmph) * 1.60934), 
            windguskmh: TwoDecimals(parseFloat(parsedData.windgustmph) * 1.60934), 
            maxdailygust: TwoDecimals(parseFloat(parsedData.maxdailygust) * 1.60934), 
            solarradiation: parsedData.solarradiation, 
            uv:  parsedData.uv, 
            lowbatt: parsedData.wh65batt, 
            freq: parsedData.freq,
            model: parsedData.model, 
            interval: parsedData.interval,
            //Datos de dentro:tempinf
            indoortempf: TwoDecimals((parseFloat(parsedData.tempinf) - 32) * 5/9),
            indoorhumidity: parsedData.humidityin
            
        }  
        return data;
    }
}