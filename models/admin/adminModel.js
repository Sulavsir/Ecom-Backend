const mongoose = require("mongoose");

const AdminModel = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:[true,"Email is compulsary"],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Your email doesnot match the format"],
        unique:true,    
    },
    verified:{
        type: Boolean, 
        required:[true,"It is necessary to mention if the user is verified or not"],
        default:false
    },
    password:{
        type:String,
        required:[true,"Password is compulsary"],
        match:[/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,"Please provide a valid password"]
    },
    photo: String,
    role:{
        type: String
    },
    allowcategory:{
        type: Number,
        default: 1
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
},{timestamps: true})

module.exports= mongoose.model("Admin-model",AdminModel);