const jwt = require('jsonwebtoken');
const CustomerModel = require('../models/customer/customerModel')
module.exports = function (req, res, next) {

    let token;
    if (req.headers['authorization'])
      token = req.headers['authorization'];
    if (req.headers['x-access-token'])
      token = req.headers['x-access-token']
    if (req.query.token)
      token = req.query.token;
  
    token = (token || '').split(' ')[1];
    // console.log('token is >', token)
    if (!token) {
      return next({
        msg: "Authentication Failed, Token Not Provided",
        status: 403
      })
    }
  
    // token verification
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return next(err)
      }
      console.log('Token Verification successfull', decoded);
      CustomerModel.findById(decoded.id, { password: 0 })
      .then((user)=>{
        if(!user){
            return next({
                msg:"User removed from system"
            })
        }
        req.user = user;
        return next();
      })
      .catch((err)=>{
        return next({
         msg:"unable to process"
        })
      })
    
  
    })
  
  
  }