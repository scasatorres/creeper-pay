import { UsersCollection, paymentStatusEnum, User } from '../models/user';

export default class UserService {
  public getExpiredPaymentUsers = async () => {
    const usersData = await UsersCollection.where(
      'paymentExpirationDate',
      '<',
      new Date(),
    )
      .where('paymentStatus', '==', paymentStatusEnum.active)
      .get();

    return usersData.docs.map(userData => userData.data()) as User[];
  };

  public updatePaymentStatus = async (user: User) => {
    user.paymentStatus = paymentStatusEnum.expired;

    return UsersCollection.doc(user.uid).update(user);
  };
}
