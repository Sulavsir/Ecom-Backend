const express= require("express");
const app= express();
require('dotenv').config();
const mongoose = require("mongoose");
const customerAPI = require("./routes/customerRoutes/customerRoutes");
const SuperAdminAPI = require("./routes/SuperAdminRoutes/SuperAdminRoutes");
const AdminAPI = require("./routes/AdminRoutes/AdminRoutes");
const subscriptionAPI  = require("./routes/subscriptionRoutes/subscriptionRoutes");
const subscriptionKhalti = require("./routes/khaltiPayment/khaltipayment");



const cors = require("cors");
const bodyParser = require('body-parser')
// app.use(cors({
//     origin: 'http://localhost:3000'
// }));
app.set('view engine', 'ejs'); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('trust proxy', 1);
app.use(cors())
mongoose.set('strictQuery', true)

//API ONLY

app.use('/api/customer',customerAPI);
app.use('/api/superAdmin',SuperAdminAPI);
app.use('/api/admin',AdminAPI);
app.use('/api/subscription',subscriptionAPI);
app.use('/api/khalti/payment/subscriber',subscriptionKhalti);















require('./Connectors/dbConnector')

app.listen(process.env.PORT,async(err,done)=>{
    if(err){
        console.log('object')
    }
    console.log(`connected to server ${process.env.PORT}`);
})


  