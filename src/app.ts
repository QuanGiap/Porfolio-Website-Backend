import express, { Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv';
import user_route from "../src/routers/User/User";
import portfolio_data_route from "./routers/PortfolioData/PortfolioData";
import auth_route from "./routers/Auth/Auth";
import image_route from "./routers/Image/Image";
const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express()

app.use(cors({
    origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders:['Content-Type', 'Authorization']
}))
app.use(express.json());
app.use(express.static('public'))
app.use('/image_route',image_route);
app.use('/user',user_route)
app.use('/auth',auth_route)
app.use('/portfolio_content',portfolio_data_route);
app.get('/', function (req:Request, res:Response) {
  res.json({msg: 'This is CORS-enabled to every website!'})
})

app.listen(PORT, function () {
  console.log('CORS-enabled web server listening on port '+PORT)
})
export default app;