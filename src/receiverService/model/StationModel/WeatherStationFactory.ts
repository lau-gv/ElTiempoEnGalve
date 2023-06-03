import { EcowittStation } from "./EcowittStation";
import { WundergroundStation } from "./WundergroundStation";

function returnWeatherStationType(parsedBody: any): WeatherStation | undefined {
        //const stationID = parsedBody?.station_id;
        //const stationKey = parsedBody?.station_key;
        const stationID = parsedBody?.ID;
        const stationKey = parsedBody?.PASSWORD;
        const passkey = parsedBody?.PASSKEY;
        
        if (stationID && stationKey) {
            return new WundergroundStation(stationID, stationKey);
        }

        if (passkey) {
            return new EcowittStation(passkey);
        }

        return undefined;
    }

export { EcowittStation, WundergroundStation, returnWeatherStationType }
