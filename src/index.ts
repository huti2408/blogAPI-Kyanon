import express from "express"
import {connectDB} from "./lib/mysql-connection";
import router from "./Routes/index"
import bodyParser from "body-parser"
import 'dotenv/config'
import ConnectRedis from "./lib/redis-helper";


connectDB()
const app = express();
const PORT = 3000;
ConnectRedis()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
router(app)

app.listen(PORT,()=>{
    console.log("Server is running at: " +PORT);
});