import express, { Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv';
import user_route from "../src/routers/User/User";
const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express()

app.use(cors({
    origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
app.use(express.static('public'))
app.use('/user/',user_route)

app.get('/', function (req:Request, res:Response) {
  res.json({msg: 'This is CORS-enabled only for example.com!'})
})

app.listen(PORT, function () {
  console.log('CORS-enabled web server listening on port '+PORT)
})
export default app;