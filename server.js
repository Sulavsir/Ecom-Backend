const express= require("express");
const app= express();
require('dotenv').config();
const mongoose = require("mongoose");
const customerAPI = require("./routes/customerRoutes/customerRoutes");
const SuperAdminAPI = require("./routes/SuperAdminRoutes/SuperAdminRoutes");
const AdminAPI = require("./routes/AdminRoutes/AdminRoutes");
<<<<<<< HEAD
const subscriptionAPI  = require("./routes/subscriptionRoutes/subscriptionRoutes");
const subscriptionKhalti = require("./routes/khaltiPayment/khaltipayment");

=======
const productAPI = require('./controller/products/productRoutes')
>>>>>>> 6f29cb5746e66bbfae102e49be8faa9504b7a108


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
require('./Connectors/dbConnector')

app.use('/api/customer',customerAPI);
app.use('/api/superAdmin',SuperAdminAPI);
app.use('/api/admin',AdminAPI);
app.use('/api/subscription',subscriptionAPI);
app.use('/api/khalti/payment/subscriber',subscriptionKhalti);
app.use('/products',productAPI)



















app.use(function (err, req, res, next) {
    console.log('error is >>', err)
    // send error response of whole application from here
    // TODO set status code in response for error response
    res.status(err.status || 400)
    res.json({
      status: err.status || 400,
      msg: err.msg || err
    })
  })

app.listen(process.env.PORT,async(err,done)=>{
    if(err){
        console.log('object')
    }
    console.log(`connected to server ${process.env.PORT}`);
})


  