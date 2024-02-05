const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(()=>{
    console.log('db connected ')
})
.catch((err)=>{
    console.log('errr in connection ',err)
})  