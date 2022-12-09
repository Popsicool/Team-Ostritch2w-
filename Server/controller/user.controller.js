/**
 * Userbase controller
 * Author: David Mebo
 * GitHub ID: meistens
 * Date Added: 08/12/2022
 *
 */
import express from 'express';
import { User } from '../database/models/index.js';
import httpErr from 'http-errors';
import { authUserSchema } from '../utils/index.js';
const userRouter = express.Router();
import { signAccTok } from '../middleware/index.js';
/**
 * GET/ Homepage
 * Author: David Mebo
 * GitHub ID: meistens
 * Date Added: 08/12/2022
 * Status: works
 *
 */

userRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'homepage here' });
});

/**
 * GET/ register
 * Author: David Mebo
 * GitHub ID: meistens
 * Date Added: 08/12/2022
 *
 */
userRouter.get('/register', (req, res) => {
  res.status(200).json({ messsage: 'GET/ register route' });
});

userRouter.post('/register', async (req, res, next) => {
  try {
    const fromJoiUserSchema = await authUserSchema.validateAsync(req.body);
    const user = await User.findOne({ email: fromJoiUserSchema.email });
    if (user) throw httpErr.Conflict(`${fromJoiUserSchema.email} already exists`);

    const newUser = new User(fromJoiUserSchema);
    const savedUser = await newUser.save();
    console.log(savedUser);

    // JWT
    const getAccessTok = await signAccTok(savedUser.id);
    console.log(getAccessTok);
    res.status(200).send({ access_token: getAccessTok });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
    console.error(err);
  }
});

export default userRouter;
