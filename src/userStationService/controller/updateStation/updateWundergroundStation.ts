import { createRandomId } from "../../../common/utils/utils";
import { WeatherStationModel } from "../../model/WeatherStationModel";
import { WundergroundStation } from "../../model/WundergroundStation";
import { StationTaskUpdate } from "../stationTasks/stationTasks";

export function updateWundergroundStation(data : WeatherStationModel): StationTaskUpdate {
 
    return {
      updateStation() {
        const key = createRandomId();
        const authStation = createRandomId();
        return new WundergroundStation(
          data.userId,
          data.stationId,
          data.authStation,
          data.key,
          data.name,
          data.location
        );
      }
    };
  }

