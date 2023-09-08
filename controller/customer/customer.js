const AdminModel = require("../../models/Admin/AdminModel");
const customerModel = require("../../models/customer/customerModel");
const SuperAdminModel = require("../../models/superAdmin/superAdminModel");
const upload = require("../../helper/uploadImage")
const {generateVerificationToken,sendVerificationEmail} = require("../../helper/sendverification");
require('dotenv').config();
const _ = require('lodash')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const customerRegister = async(req,res)=>{
  if(req.file){
   const uploadedImage= req.file.filename
  }
  console.log('req.file',req.file)
    const Clients = _.pick(req.body,[
        'email',
        'password',
        'name',
        'photo',
    ]);
   
    const filterData = {
    email:req.body.email,
    isDeleted:false
    }

    if(!req.body.email) return res.status(400).json('email is empty!');
    if(!req.body.password) return res.status(400).json('password is empty');
    if(!req.body.name) return res.status(400).json('name is empty');
    try { 
      
      const existingAdmin = await AdminModel.findOne(filterData)
      console.log(existingAdmin);
      if(existingAdmin){
          return res.status(400).json({message:'Account already created using this Email !!'});
      }
      const existingCustomer = await customerModel.findOne(filterData)
      if(existingCustomer){
          return res.status(400).json({message:'Account already created using this Email !!'});
      }
      const existingSuperAdmin = await SuperAdminModel.findOne(filterData)
      if(existingSuperAdmin){
          return res.status(400).json({message:'Account already created using this Email !!'});
      }
        // Create verification token and link
      const verificationToken = generateVerificationToken(); // Implement this function
      const verificationLink = `${req.protocol}://${req.get('host')}/customer/verify/${verificationToken}?email=${encodeURIComponent(Clients.email)}`;
      
      
       //password hash
       const hashPassword = await bcrypt.hash(Clients.password,12);
       // Save user data with verification status "pending"
       Clients.role = "CLIENT";
       const modelDoc = new customerModel({
         ...Clients,
         verificationToken,
         verified: false,
         password: hashPassword,
         photo:  req.file.filename
       });

      //  if(req.file){
      //   modelDoc.photo=req.file.filename

      //  }
       const savedData = await modelDoc.save();
   
       if (savedData && savedData._id) {
         sendVerificationEmail(savedData.email, verificationLink); // Implement this function
         
         return res.status(200).json({
           message: 'Verification email has been sent to your email'
         });
       }
   
       return res.status(400).json({
         message: 'Unable to add your  details.',
       });

    } catch (error) {
        console.log('error ----->',error)
        return res.status(400).json('Unable to process');
    }
};

//for email verifications 
const verification = async (req, res) => {
    const verificationToken = req.params.verificationToken;
    const userEmailAddress = req.query.email;
  
    try {
      // Find the user based on the verification token
      const user = await customerModel.findOne({
        verificationToken,
        email: userEmailAddress,
        verified: false// Check that the user's status is pending
      });
  
      if (!user) {
        return res.status(400).json({
          message: 'Invalid or expired verification token.',
        });
      }
  
      // Update the user's verification status to "verified"
      user.verified = true;
      await user.save();
  
      return res.json({
        message: 'Email verified successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  };

const customerLogin = async (req, res) => {
  console.log("i am here")
    //   const errors = {};
      const { email, password } = req.body;
      if(!email) return res.status(400).json({message:"please enter email"});
      if(!password) return res.status(400).json({message:"please enter password"});
      console.log(email,password);

      const filterData ={
        email:req.body.email,
        isDeleted:false
      };
      // const isEmail = validator.isEmail(email);
      try {
      let ClientData = await customerModel.findOne(filterData);
      if (!ClientData) {
       ClientData = await SuperAdminModel.findOne(filterData);
      } 
      if(!ClientData){
        ClientData = await AdminModel.findOne(filterData);
      } 
      if(!ClientData){
        return res.status(400).json({message:"please register first"})
      }
      if (ClientData) {
              console.log('clientData--->',ClientData)
        if(ClientData.verified === true){
        bcrypt.compare(password, ClientData.password, (err, isMatch) => {
        if (err) {
          return console.log(err);
        }
        if (isMatch) {
          // user matched
                const JWTPayload = {
                  id: ClientData._id,
                  role: ClientData.role
              };
          console.log('JWTPayload', JWTPayload);
          // sign Token
          jwt.sign(
          JWTPayload,
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.CLIENT_SESSION_EXPIRES_IN // session active duration
          },
          async (_err, token) => {
            if (!_err) {
            res.status(200).json({
              token: `Bearer ${token}`,message: "successfully login"
            });
            } else {
            console.log(_err);
            }
          }
          );
        } else {
          // password do not match
        //   .password= 'Password do not match';
          return res.status(401).json({password:'Password do not match' });
              }
        });
      } else {
      
            return res.status(400).json({message: "your email is not verified!!"})
        
      }
    }
      else{
              return res.status(401).json({ message:'no such user found through this email ' });
        
      }
      } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.'
      });
      }
      return false;
    };

    const UpdateCustomerProfilepic = async(req,res) =>{
      const userId = req.body.id

	  const itemBody = _.pick(req.body, [
		  'images',
	  ]);
//    console.log('sjshds',itemBody)
    if(!itemBody){
      res.status(400).json({message:"please provide your image"})
      }
    try{
      if (userId) {
      const existingId = await customerModel.findOne({
        _id: userId,
          isDeleted: false
        });
      if (existingId) {
      const update = await customerModel.findOneAndUpdate(
        {_id:userId},
        {$set:itemBody},
        {new: true}
      );
      if(update){
        return res.status(200).json({message:"successfully updated!!"});
       }
      else{
        return res.status(400).json({message:"unable to update picture"});
          }
        }
      else{
          return res.status(400).josn({message:"customer doesn't exist!!!!"});
        }   
      }
      }
      catch(error){
      return res.status(400).json({message:"unable to process at this moment"});
        }
        }
  module.exports = {customerRegister,verification, customerLogin ,UpdateCustomerProfilepic};