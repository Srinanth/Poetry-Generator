import {Router} from 'express';
import { getAllUsers, myProfile, userlogin, userSignup, verifyUser } from '../controllers/user-controller.js';
import {validate, signUpvalidator, loginvalidator } from '../utils/validator.js';
import { verifyToken } from '../utils/token-manager.js'; 

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post("/SignUp",validate(signUpvalidator), userSignup);
userRouter.post("/login",validate(loginvalidator), userlogin);
userRouter.get("/auth-status",verifyToken, verifyUser);
userRouter.get("/me",verifyUser,myProfile)


export default userRouter;