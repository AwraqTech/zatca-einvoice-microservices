import express, { Application} from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import simpleInvGenRouter from '../routers/simpleInvGenRouter';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/invoice', simpleInvGenRouter);

export default app;