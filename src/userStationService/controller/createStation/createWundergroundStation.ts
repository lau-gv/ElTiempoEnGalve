import { createRandomId } from "../../../common/utils/utils";
import { WeatherStationModel } from "../../model/WeatherStationModel";
import { WundergroundStation } from "../../model/WundergroundStation";

export function createWundergroundStation(data : WeatherStationModel): StationTaskCreate {
 
    return {
      createStation() {
        const key = createRandomId();
        const authStation = createRandomId();
        return new WundergroundStation(
          data.userId,
          data.stationId,
          authStation,
          key,
          data.name,
          data.location
        );
      }
    };
  }

