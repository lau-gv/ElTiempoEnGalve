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
            id: stationId,
            datetime: parsedData.spainTime,
            authStation: this.getAuth(),
            temperature: this.TwoDecimals((parseFloat(parsedData.tempf) - 32) * 5/9),
            humidity:  parsedData.humidity,
            baromrelhpa: this.TwoDecimals(parseFloat(parsedData.baromrelin)* 33.86388640341),  
            baromabshpa: this.TwoDecimals(parseFloat(parsedData.baromabsin)* 33.86388640341), 
            rainrateinmm: this.TwoDecimals(parseFloat(parsedData.rainratein) * 25.4), 
            eventraininmm : this.TwoDecimals(parseFloat(parsedData.eventrainin)* 25.4) , 
            hourlyraininmm: this.TwoDecimals(parseFloat(parsedData.hourlyrainin)* 25.4),
            dailyraininmm: this.TwoDecimals(parseFloat(parsedData.dailyrainin)* 25.4),
            weeklyraininmm: this.TwoDecimals(parseFloat(parsedData.weeklyrainin )* 25.4),
            monthlyraininmm: this.TwoDecimals(parseFloat(parsedData.monthlyrainin)* 25.4),
            winddir: parseFloat(parsedData.winddir), 
            windspeekmh: this.TwoDecimals(parseFloat(parsedData.windspeedmph) * 1.60934), 
            windguskmh: this.TwoDecimals(parseFloat(parsedData.windgustmph) * 1.60934), 
            maxdailygust: this.TwoDecimals(parseFloat(parsedData.maxdailygust) * 1.60934), 
            solarradiation: parsedData.solarradiation, 
            uv:  parsedData.uv, 
            lowbatt: parsedData.wh65batt, 
            freq: parsedData.freq,
            model: parsedData.model, 
            interval: parsedData.interval,

            //Datos de dentro:tempinf
            indoortempf: this.TwoDecimals((parseFloat(parsedData.tempinf) - 32) * 5/9),
            indoorhumidity: parsedData.humidityin
            
        }  
        return data;
    }

    private TwoDecimals(number: number): number{
        return Math.round(number * 100) / 100;
    }
}