const AdminModel = require("../../models/Admin/AdminModel");
const customerModel = require("../../models/customer/customerModel");
const SuperAdminModel = require("../../models/superAdmin/superAdminModel");


const checker = async(req,res) =>{
    const email = req.body;
   
    const filterData = {
    email:email,
    isDeleted:false
    }
try{
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
    }
    catch(error){
        return res.status(400).json({message:error});
    }
}

module.exports = checker;