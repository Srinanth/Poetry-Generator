import {Router} from 'express';
import userRouter from './user-route';
import chatRouter from './chat-route';

const approuter = Router();

approuter.use('/user',userRouter);
approuter.use('/chat',chatRouter);

export default approuter;