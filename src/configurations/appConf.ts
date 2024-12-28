import express, { Application} from 'express';
import cors from "cors";
import simpleInvGenRouter from '../routers/simpleInvGenRouter';
import csrGenerateRouter from '../routers/csrGenerateRouter';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/invoice', simpleInvGenRouter);
app.use('/egs', csrGenerateRouter);

export default app;