const khaltipayment_query = require('./khalti_product_query')

async function khaltiPayment(req,res,next){
    return res.json({msg:'do here khalti controll logic'})
}
async function findAllSalesProduct(req,res,next){
    let condition = {};
    try {
     const existingSalesData = await khaltipayment_query.findAll(condition)  
    //  if(!existingSalesData){
    //     return res.status(404).json({
    //         msg:'sales data not found'
    //     })
    //  } 
     return res.status(200).json({
        data:existingSalesData
     })
    } catch (error) {
      next(error)  
    }
}

module.exports ={
findAllSalesProduct,
khaltiPayment
}