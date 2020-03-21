import { updateableUserFields } from './../../../models/user';
import { Container } from 'typedi';
import express, { Response } from 'express';
import { Request } from '../../../models/extended-request';
import { User, BasicUser } from '../../../models/user';
import { isAuthenticated } from '../../../middlewares/auth';
import UserService from '../../../services/user';

const router = express.Router();
const userService = Container.get<UserService>(UserService);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const basicUserData: BasicUser = {
      username,
      email,
      password,
    };

    const user = await userService.signup(req, basicUserData, res);

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      throw new Error();
    }

    const user = await userService.login(req, uid, res);

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(400).send();
  }
});

router.get('/me', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = userService.getCurrentUser(req);

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.patch('/me', isAuthenticated, async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = updateableUserFields;
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update),
  );
  const userData: User = {} as User;

  if (!isValidOperation) {
    return res.status(400).send('Error: Invalid updates!');
  }

  try {
    updates.forEach(update => (userData[update] = req.body[update]));

    const user = userService.updateCurrentUser(req, userData);

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete('/me', isAuthenticated, async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req, res);

    return res.status(200).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

export { router as userRouter };
