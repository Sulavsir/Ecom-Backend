const Tax =  require('../../models/taxModel/taxModel');

const AllTax = async(req,res) =>{
    try{
        console.log("taxs....")
        const taxs = await Tax.find({}).sort({CreatedAt: -1});
        return res.status(200).json({message:"All the taxs",taxs:taxs});
    }
    catch (err){
        return res.status(500).json({error: 'error fetching data'})
    }

}
const createTax = async(req,res) =>{
    try{
    const tax = await Tax.create({...req.body});
    if(!req.body.name) return res.status(400).json({message:'name of the tax must be mentioned'});
    if(!req.body.chargePercentage) return res.status(400).json({message:'ChargePercentage must be included or given'});
    //tax.save();
    return res.status(200).json({message:'tax is created successfully',tax:tax});
    }
    catch (error){
        return res.status(400).json({error:'error creating tax'});
    }
}
const updateTax = async(req,res) =>{
    const id = req.params.id;
    const name = req.body.name;
    const chargePercentage =req.body.chargePercentage;
    const isEnabled = req.body.isEnabled === false ? false : true;
    const isGlobal  = req.body.isGlobal === true ? true : false; 
    const submitButton = req.body.submitButton === true ? true : false;

      const updated = await Tax.findByIdAndUpdate(id,
        {$set:{name : name,chargePercentage : chargePercentage, isEnabled : isEnabled,
        isGlobal : isGlobal, submitButton : submitButton }},{new:true});
        if(updated){
            return res.status(200).json({message:'Tax detail has been updated',tax: updated});
            //res.redirect('/All-Tax');
        }else{
            return res.status(400).json({message:"error updating tax data!!"});
        }
    
}
const deleteTax = async(req,res) =>{
    const id = req.params.id;
    await Tax.findByIdAndDelete(id,(error,tax)=>{
        if(error){
            return res.status(500).json({error:'error while deleting Data'});
        }
        if(!tax){
            return res.status(404).json({error:'DATA NOT FOUND!!'})
        }
        res.status(200).json({message:'successfully deleted the Data',deleted:deleted});
    })
}
const searchTax = async(req,res) =>{
    const name = req.body.name;
     Tax.findOne({name : name},(error,tax) =>{
        if(error){
           return res.status(500).json({error:'error occured searhing Data'})
        }if(!Tax){
            return res.status(404).json({error:'DATA NOT FOUND!!!'})
        }
        res.status(400).json({message: 'DATA Found',tax})
    });
}
module.exports = {AllTax,createTax,updateTax,deleteTax,searchTax};