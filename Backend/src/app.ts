import express from 'express';
import {config} from 'dotenv';
import approuter from './routes';
import { cookie } from 'express-validator';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config();

const app = express();



//middleware
app.use(cors({origin:'http://localhost:5173',credentials:true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE));




app.use('/api/v1',approuter);

export default app;