export class WundergroundStation implements WeatherStation{
    
    public readonly receiveIdentifier: string;
    public readonly passkey: string;
    
    constructor (receiveIdentifier: string, passkey: string){
        this.receiveIdentifier = receiveIdentifier;
        this.passkey = passkey;
    }

    getAuth() {
        return this.receiveIdentifier + this.passkey;    
    }

    formatData(stationId: string, parsedData: any) {
        const data : StationData = {
            id: stationId,
            datadatetime: parsedData.spainTime,
            authStation: this.getAuth(),
            temperature: this.TwoDecimals((parseFloat(parsedData.tempf) - 32) * 5/9),
            humidity:  parsedData.humidity,
            baromrelhpa: this.TwoDecimals(parseFloat(parsedData.baromin)* 33.86388640341),  
            baromabshpa: this.TwoDecimals(parseFloat(parsedData.absbaromin)* 33.86388640341), 
            rainrateinmm: this.TwoDecimals(parseFloat(parsedData.rainratein) * 25.4), 
            eventraininmm : this.TwoDecimals(parseFloat(parsedData.eventrainin)* 25.4) , 
            hourlyraininmm: this.TwoDecimals(parseFloat(parsedData.hourlyrainin)* 25.4),
            dailyraininmm: this.TwoDecimals(parseFloat(parsedData.dailyrainin)* 25.4),
            weeklyraininmm: this.TwoDecimals(parseFloat(parsedData.weeklyrainin )* 25.4),
            monthlyraininmm: this.TwoDecimals(parseFloat(parsedData.monthlyrainin)* 25.4),
            yearlyraininmm: this.TwoDecimals(parseFloat(parsedData.yearlyrainin)* 25.4),
            winddir: parseFloat(parsedData.winddir), 
            windspeekmh: this.TwoDecimals(parseFloat(parsedData.windspeedmph) * 1.60934), 
            windguskmh: this.TwoDecimals(parseFloat(parsedData.windgustmph) * 1.60934), 
            maxdailygust: this.TwoDecimals(parseFloat(parsedData.maxdailygust) * 1.60934), 
            solarradiation: parsedData.solarradiation, 
            uv: parsedData.UV, 
            lowbatt: parsedData.lowbatt, 
            model: parsedData.softwaretype, 
            interval: parsedData.rtfreq,
            dewptfC: this.TwoDecimals((parseFloat(parsedData.dewptf) - 32) * 5/9),
            windchillC: this.TwoDecimals((parseFloat(parsedData.windchillf) - 32) * 5/9),
            //windchillf
            //Datos de dentro:tempinf
            indoortempf: this.TwoDecimals((parseFloat(parsedData.indoortempf) - 32) * 5/9),
            indoorhumidity: parsedData.indoorhumidity
        }  
        return data;
    }

    private TwoDecimals(number: number): number{
        return Math.round(number * 100) / 100;
    }
}