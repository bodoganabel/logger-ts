import 'module-alias/register';
import express from 'express';
import { greeterRouter } from '@controllers/';

const app = express();
const port = process.env.PORT || 3000; // default port to listen

app.use('/api', greeterRouter);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

app.get('/', (_req, res) => {
    res.send("Server is up!<br/>Try: /api/greeter?name=Tester");
});
    