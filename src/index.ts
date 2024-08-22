import express, { Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv';
import user_route from "./routers/User/User";
dotenv.config();

const app = express()

app.use(cors({
    origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use('/user/',user_route)

app.get('/', function (req:Request, res:Response) {
  res.json({msg: 'This is CORS-enabled only for example.com!'})
})

app.listen(3000, function () {
  console.log('CORS-enabled web server listening on port 3000')
})