
const {Subscription} = require('../../models/subscription/subscription');





const createSubscription = async (req,res) =>{
    console.log('hello------>',req.body);
    try{
        
  const subscriptionCreated = await Subscription.create({...req.body});

  return res.status(200).json({message:'created successfully!!',subscriptionCreated : subscriptionCreated});
  //return res.redirect('/subscription');
}
catch(error){

  res.status(500).json({error:error});
  console.log('error is ',error);
  }
}

const AllSubscriptionSchems = async (req,res) =>{
  try{
    const subscriptions = await Subscription.find({}).sort({createdAt: -1});
    return res.status(200).json({ subscriptions })
  }
  catch(error){
    res.status(500).json({error:error})
  }

}

const updateSubscription = async(req,res) =>{
  try{
     const {id} = req.params;
    const {name,description,plans} = req.body;
    
     const queryObject = {};
     if(name) queryObject.name = name;
     console.log(name);
     if(description) queryObject.description = description;
     if(plans)//must give all the properties 
     queryObject.plans = plans;

     console.log(plans);

    const updated = await Subscription.findOneAndUpdate({_id:id},
      {...queryObject},{new : true, runValidators: true});
    return res.status(200).json({message: 'updated successfully',updated:updated});
  }
  catch(error){
    return res.status(500).json({error:error});
  }
}
const AddPlans = async(req,res) =>{
  console.log("adding  plann.....")
  try{
    const {id}  = req.params;
    console.log(id)
    queryObject ={}
    const {plan} = req.body;
    if(plan) queryObject.plans = plan;
    const toBeUpdated = await Subscription.findOne({_id:id});
    console.log(toBeUpdated.plans);
    toBeUpdated.plans = [...toBeUpdated.plans, plan];
    await toBeUpdated.save();
    return res.status(200).json({message:"plan Added successfully",toBeUpdated:toBeUpdated});
  }catch(error){
    return res.status(500).json({error:error})
  }
}

const deleteSubscription = async (req,res) =>{
  try{
    const id = req.params.id;
    const deletedData = await Subscription.findOneAndDelete({_id:id});
    return res.status(200).json({message:'Removed successfully',deletedData: deletedData});
  }
  catch(error){
    return res.status(500).json({error:error});
  }
}

module.exports ={deleteSubscription,updateSubscription,createSubscription,AllSubscriptionSchems,AddPlans};