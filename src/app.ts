import express, { Express, NextFunction, Request, Response } from 'express';
import { config as configEnvironment } from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import {createStream as createRotatingFileStream} from 'rotating-file-stream';
import nunjucks from 'nunjucks';




configEnvironment();

//CONFIG_VARIABLES
process.env.PORT = process.env.PORT ? process.env.PORT : '3000';
process.env.HOST = process.env.HOST ? process.env.HOST : '127.0.0.1';
process.env.APP_ENV = process.env.APP_ENV ? process.env.APP_ENV : 'DEV';
//CONFIG_VARIABLES_END

//APP
const app: Express = express();
//APP_END

//APP_BODY
app.use(express.json());
app.use(express.urlencoded());
//APP_BODY_END

//LOGGING
const fileLogPath = path.join(__dirname, '..', 'logs');

const accessLogStream = createRotatingFileStream('log.txt', {
    interval: '1d', // rotate daily
    path: fileLogPath
});

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
    stream: accessLogStream
}));
//LOGGING_END

//VIEWS
const nunjucksEnv = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('views', path.join(__dirname, '../views'));
//END_VIEWS

//404_ERROR
app.get('*', (req: Request, res: Response) => {
    return res.status(404).render('404.html');
});
//404_ERROR_END

const server = app.listen(parseInt(process.env.PORT), process.env.HOST, () => {
    console.log(`[+] Server started at http://${process.env.HOST}:${process.env.PORT}`);
});