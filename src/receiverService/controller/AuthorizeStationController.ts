import { returnWeatherStationType } from "../../common/model/StationModel/WeatherStationFactory";
import { getIdByAuthStation } from "../../common/services/repository/EstacionRepository/DynamoStationDB";

export async function authorizeStation(event: any, STATION_TABLE: string) {

    var authorize = {
      "authorization": "false",
      "body": event.body
    };
  
    try {
      const parsedBody = JSON.parse(event.body);
      const station: WeatherStation | undefined = returnWeatherStationType(parsedBody);
  
      if (station) {
        const id: string | undefined = await getIdByAuthStation(STATION_TABLE, station.getAuth());
  
        if (id) {
          const dataTransformed = JSON.stringify((station.formatData(id, parsedBody)));
          authorize = {
            "authorization": "true",
            "body": dataTransformed
          };
          console.log(`Este es el id de la estacion: ${id} y esta el body ${dataTransformed}`);
        }
      }
    } catch (Error: any) {
      console.log(`ha habido un errorcito!  ${Error.message}`);
    }
  
    return authorize;
  }
  