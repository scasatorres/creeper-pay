import {
  MinecraftOnlineUUID,
  MinecraftOfflineUUID,
} from '../models/minecraft-uuid';
import got from 'got';

export default class MinecraftUUIDService {
  public getUUID = async (username: string) => {
    const baseUUIDUrl =
      process.env.ONLINE_MODE === 'ON'
        ? process.env.UUID_URL
        : process.env.UUID_GENERATOR_URL;
    const uuidUrl = `${baseUUIDUrl}/${username}`;

    const uuidResponse = await got.get(uuidUrl);

    if (!uuidResponse.body) {
      throw new Error();
    }

    let minecraftUUID;
    if (process.env.ONLINE_MODE === 'ON') {
      const uuidObj: MinecraftOnlineUUID = JSON.parse(uuidResponse.body);

      minecraftUUID = this.onlineUUIDParser(uuidObj.id);
    } else {
      const uuidGeneratorObj: MinecraftOfflineUUID = JSON.parse(
        uuidResponse.body,
      );

      minecraftUUID = uuidGeneratorObj.offlinesplitteduuid;
    }

    return minecraftUUID;
  };

  public onlineUUIDParser = (uuid: string): string => {
    const regExp = new RegExp(/^(.{8})(.{4})(.{4})(.{4})(.{12})/, 'g');
    const regExpExecArray: RegExpExecArray = regExp.exec(uuid);

    return regExpExecArray.slice(1, regExpExecArray.length).join('-');
  };
}
