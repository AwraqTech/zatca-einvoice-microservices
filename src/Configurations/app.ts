import express, { Application } from 'express';
import bodyParser from 'body-parser';
import eInvoiceRoute from '../Routes/eInvoiceRoute';

const app: Application = express();
app.use(bodyParser.json());

app.use('/', eInvoiceRoute);

export default app;