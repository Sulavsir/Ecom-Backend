const { update } = require('lodash')
const khaltipayment = require('../../models/KhaltiProductSchema/khalti_product.schema')

function map_khalti_payment(purchaseDetails,product){
    if(purchaseDetails.productDetails)
     product.productDetails = purchaseDetails.productDetails
    if(purchaseDetails.transactionId)
     product.transactionId = purchaseDetails.transactionId
    if(purchaseDetails.brand)
     product.brand = purchaseDetails.brand
    if(purchaseDetails.salesDate)
     product.salesDate = purchaseDetails.salesDate
    if(!product.discount)
     product.discount ={}
    if(purchaseDetails.discountProduct)
     product.discount.discountProduct = purchaseDetails.discountProduct
    if(purchaseDetails.discountType)
     product.discount.discountType = purchaseDetails.discountType
    if(purchaseDetails.discountValue) 
     product.discount.discountType = purchaseDetails.discountType
    if(purchaseDetails.discountedAmount)
     product.discountedAmount = purchaseDetails.discountedAmount
    if(purchaseDetails.distanceAmount)
     product.distanceAmount = purchaseDetails.distanceAmount
    if(purchaseDetails.distance)
     product.distance = purchaseDetails.distance 
    if(purchaseDetails.deliveredDate)
     product.deliveredDate = purchaseDetails.deliveredDate
    if(purchaseDetails.deliveryType)
     product.deliveryType = purchaseDetails.deliveryType
    if(purchaseDetails.status)
     product.status = purchaseDetails.status
    if(purchaseDetails.totalamount)
     product.totalamount = purchaseDetails.totalamount
    if(purchaseDetails.isGems)
     product.isGems = purchaseDetails.isGems
    if(purchaseDetails.paymenMode)
     product.paymenMode = purchaseDetails.paymenMode
}

function initiateKhaltiPayment(data){
//todo khalti query 
throw ({msg:'query here'})
}
function findAll(condition){
  khaltipayment
  .find(condition)
  .sort({
    deliveredDate:-1
  })
  .then((salesProduct)=>{
    if(!salesProduct){
        throw({msg:'product not found'})
    }
    return salesProduct
  })
  .catch((error)=>{
    console.log('error occured while fetching sales data')
    throw({error:error})
  })

}

function findindividulaSalesProduct(id){
    khaltipayment
    .findOne({orderId:id})
    .then((product)=>{
        if(!product){
            throw({msg:'product not found'})
        }
        return product
    })
    .catch((error)=>{
        console.log('error occured while fetching individual sales product')
        throw({error:error})
    })
}

function updateStatus(id,status){
    try {
       khaltipayment
       .findOneAndUpdate({orderId:id.orderId},
        {$set:{status:status}},
        {new:true})
        .then((update)=>{
            console.log('updated',update)
            if(!update){
                throw({msg:'product not updated'})
            }
            return update
        })
        .catch((error)=>{
            console.log('error while update status')
            throw({error:error})
        })
    } catch (error) {
        throw({error:error})
    }
}


module.exports ={
    findAll,
    findindividulaSalesProduct,
    updateStatus,
    initiateKhaltiPayment
}