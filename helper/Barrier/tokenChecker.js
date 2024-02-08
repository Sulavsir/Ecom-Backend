const jwt = require('jsonwebtoken')
const customerModel = require('../../models/customer/customerModel')

module.exports=async function security(req,res,next)
{
    if(!req.headers.authorization)
    {
        res.status(400).json({msg:"Unauthorized access"})
    }   
    const bearer = req.headers.authorization;
    if(bearer){
        const token = bearer && bearer.split(" ")[1]
        jwt.verify(token,process.env.JWT_SECRET,async (err,user) => {
            //user = { role: customer, id:id12 e123}
            if(user.role === 'customer'){
                const found = await customerModel.findOne({_id:user.id})
                if(found)
                {
                    return next()
                }
                return res.status(404).json({msg:""})
            }

        })
    }
}
