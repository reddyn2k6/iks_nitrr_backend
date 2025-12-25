import express from "express"
import connectDB from './config/connectDB.js'
import 'dotenv/config.js';
import router from "./routes/people.js";
const app=express();

const PORT=4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use('/person',router);

app.listen(PORT,()=>{
    console.log("Server Started on ",PORT);
})