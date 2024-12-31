import express, { Application} from 'express';
import cors from "cors";
import simpleInvGenRouter from '../routers/simpleInvGenRouter';
import csrGenerateRouter from '../routers/csrGenerateRouter';
import testRouter from '../routers/testRouter';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/invoice', simpleInvGenRouter);
app.use('/egs', csrGenerateRouter);

app.use('/test', testRouter);

export default app;