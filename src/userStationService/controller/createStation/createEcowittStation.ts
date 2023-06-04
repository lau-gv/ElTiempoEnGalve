import { MissingFieldError } from "../../../common/utils/Validator";
import { encryptMD5 } from "../../../common/utils/utils";
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
        encryptMD5(data.key).toUpperCase(),
        data.name,
        data.location,
        data.key,
      );
    }
  };
}

function validateAsEcowittStation(arg: WeatherStationModel){

  if (arg.key == undefined) {
      throw new MissingFieldError('key')
  } 
}
