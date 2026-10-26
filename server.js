  require('dotenv').config();
const express=require('express');
const connectToDB=require("./config/db.js");

const app=express();

 app.use(express.json());
 connectToDB();

 const PORT=process.env.PORT||8000;

 app.listen(PORT,()=>{
     console.log(`Server is running at port ${PORT}`);
 })

