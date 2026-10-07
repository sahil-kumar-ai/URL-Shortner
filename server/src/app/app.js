import express from 'express';
import router from '../routes/url.routes.js';
import { redirectUrl } from '../controller/url.controller.js';

const app = express();
app.use(express.json());

app.use('/api/url', router);
app.get('/:code', redirectUrl);

export default app;