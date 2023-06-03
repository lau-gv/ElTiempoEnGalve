import { MissingFieldError } from "../../../common/utils/Validator";
import { EcowittStationModel } from "../../model/EcowittStationModel";
import { WeatherStationModel } from "../../model/WeatherStationModel";
import { StationTaskCreate } from "../stationTasks/stationTasks";

export function createEcowitStation(data:WeatherStationModel): StationTaskCreate {
 
  return {
    createStation() {
      validateAsEcowittStation(data);
      //(userId: string, stationId: string, authStation: string, key: string, name: string, location: string):
      return new EcowittStationModel(
        data.userId,
        data.stationId,
        data.authStation,
        data.name,
        data.location
      );
    }
  };
}

function validateAsEcowittStation(arg: WeatherStationModel){

  if (arg.authStation == undefined) {
      throw new MissingFieldError('authStation')
  } 
}
