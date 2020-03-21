import * as fs from 'fs';
import { WhitelistUser } from './../models/whitelist';
import { User } from './../models/user';

export default class WhitelistService {
  public getWhitelistUsers = (): Promise<WhitelistUser[]> => {
    return new Promise((resolve, reject) => {
      try {
        const whitelistPath = process.env.WHITELIST_PATH;

        fs.open(whitelistPath, 'a+', (error, fd) => {
          if (error) {
            throw new Error(error.message);
          }

          fs.readFile(whitelistPath, (error, data) => {
            if (error) {
              throw new Error(error.message);
            }

            const dataJSON = data.toString();
            const users: WhitelistUser[] = dataJSON ? JSON.parse(dataJSON) : [];

            fs.close(fd, error => {
              if (error) {
                throw new Error(error.message);
              }
            });

            return resolve(users);
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  };

  public addUser = (
    user: User,
    whitelistUsers: WhitelistUser[],
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const whitelistUser: WhitelistUser = {
        uuid: user.minecraftUUID,
        name: user.username,
      };

      const allowedUsers: WhitelistUser[] = [...whitelistUsers, whitelistUser];
      const allowedUsersJSON = JSON.stringify(allowedUsers);

      fs.writeFile(process.env.WHITELIST_PATH, allowedUsersJSON, () => {
        return resolve();
      });
    });
  };

  public updateUser = (
    updatedUserData: User,
    oldUserData: User,
    whitelistUsers: WhitelistUser[],
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const whitelistUser: WhitelistUser = {
        uuid: updatedUserData.minecraftUUID,
        name: updatedUserData.username,
      };

      const filteredWhitelistUsers = whitelistUsers.filter(
        user => user.uuid !== oldUserData.minecraftUUID,
      );
      const allowedUsers: WhitelistUser[] = [
        ...filteredWhitelistUsers,
        whitelistUser,
      ];
      const allowedUsersJSON = JSON.stringify(allowedUsers);

      fs.writeFile(process.env.WHITELIST_PATH, allowedUsersJSON, () => {
        return resolve();
      });
    });
  };

  public removeUser = async (
    user: User,
    whitelistUsers: WhitelistUser[],
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const allowedUsers: WhitelistUser[] = whitelistUsers.filter(
        whitelistUser => whitelistUser.uuid !== user.minecraftUUID,
      );
      const allowedUsersJSON = JSON.stringify(allowedUsers);

      fs.writeFile(process.env.WHITELIST_PATH, allowedUsersJSON, () => {
        return resolve();
      });
    });
  };

  public removeExpiredPaymentUsers = (
    expiredPaymentUsers: User[],
    whitelistUsers: WhitelistUser[],
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const allowedUsers: WhitelistUser[] = whitelistUsers.filter(user => {
        return !expiredPaymentUsers.find(
          expiredPaymentUser => expiredPaymentUser.minecraftUUID === user.uuid,
        );
      });

      const allowedUsersJSON = JSON.stringify(allowedUsers);

      fs.writeFile(process.env.WHITELIST_PATH, allowedUsersJSON, () => {
        return resolve();
      });
    });
  };
}
