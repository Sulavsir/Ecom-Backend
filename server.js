const express= require("express");
const app= express();
require('dotenv').config();
const mongoose = require("mongoose");



const cors = require("cors");
const bodyParser = require('body-parser')
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.set('view engine', 'ejs'); 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('trust proxy', 1);


app.use(cors())
mongoose.set('strictQuery', true)

require('./Connectors/dbConnector')

app.listen(process.env.PORT,async(err,done)=>{
    if(err){
        console.log('object')
    }
    console.log(`connected to server ${process.env.PORT}`);
})


  