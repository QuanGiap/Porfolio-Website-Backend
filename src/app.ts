import express, { Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv';
import user_route from "../src/routers/User/User";
import test_route from "./routers/test/testRoute";
import portfolio_data_route from "./routers/PortfolioData/PortfolioData";
import auth_route from "./routers/Auth/Auth";
const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express()

app.use(cors({
    origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
app.use(express.json());
app.use(express.static('public'))
app.use('/user/',user_route)
app.use('/auth/',auth_route)
app.use('/test',test_route);
app.use('/portfolio_content',portfolio_data_route);
app.get('/', function (req:Request, res:Response) {
  res.json({msg: 'This is CORS-enabled only for example.com!'})
})

app.listen(PORT, function () {
  console.log('CORS-enabled web server listening on port '+PORT)
})
export default app;