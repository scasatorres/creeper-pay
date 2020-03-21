import { CronJob } from 'cron';
import { Container } from 'typedi';
import { WhitelistUser } from './../models/whitelist';
import { User } from '../models/user';
import UserService from '../services/user';
import WhitelistService from '../services/whitelist';

const userService = Container.get<UserService>(UserService);
const whitelistService = Container.get<WhitelistService>(WhitelistService);

const job = new CronJob('* */20 * * * *', async () => {
  const whitelistUsers: WhitelistUser[] = await whitelistService.getWhitelistUsers();

  if (!whitelistUsers.length) {
    return;
  }

  const expiredPaymentUsers: User[] = await userService.getExpiredPaymentUsers();

  if (!expiredPaymentUsers.length) {
    return;
  }

  const updatePaymentStatusPromises = expiredPaymentUsers.map(
    userService.updatePaymentStatus,
  );

  Promise.all(updatePaymentStatusPromises);

  await whitelistService.removeExpiredPaymentUsers(
    expiredPaymentUsers,
    whitelistUsers,
  );
});

job.start();
