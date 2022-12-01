import express, { json } from 'express';
import { doWork } from './controllers/puppeteerController.js';

const app = express();

app.use(json())

const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    res.json({ status: true, message: "Our node.js app works" });
    doWork();
});

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));