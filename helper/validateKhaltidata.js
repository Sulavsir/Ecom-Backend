const ProductSchema = require('../models/product/productSchema')
module.exports = async function validateKhaltidata(data) {
    let totalAmount = 0;
    let totalamount=0;
    let calculatedKhaltiData =[];
    const invaliddata = [];

    // console.log('------>',data.productDetails);

    if (!data.productDetails || !Array.isArray(data.productDetails)) {
        return { error: {
            msg:'Invalid productDetails array'
        }};
    }

    for (const product of data.productDetails) {
        const id = {
            _id: product.productId,
        };
        const existingData = await ProductSchema.find(id);
        if (Array.isArray(existingData) && existingData.length > 0) {
            for (const existingProduct of existingData) {
                const isValidQuantity = parseInt(product.quantity) <= parseInt(existingProduct.quantity);
                if (!isValidQuantity) {
                    invaliddata.push({
                        existingProduct: product,
                        isValidQuantity,
                    });
                    return {
                        error: {
                            msg: 'The provided quantity is not available. You can buy except this product',
                            invaliddata,
                        },
                    };
                }
                totalamount = existingProduct.price * parseInt(product.quantity);
                if (product.price != totalamount) {
                    return { error:{
                       msg: 'Invalid amount'
                     } };
                }
                if(existingProduct){
                    if( existingProduct.discount?.discountType==='value'){
                        const discountValue =parseInt(existingProduct.discount?.discountValue)*parseInt(product.quantity)
                        console.log(discountValue);
                      totalamount=totalamount-discountValue
                      calculatedKhaltiData.push({
                        identity:product.productId,
                        name:discountValue.toString(),
                        total_price:totalamount,
                        quantity:product.quantity,
                        unit_price:existingProduct.price,
                      })
                     }
                     if(existingProduct.discount?.discountType ==='percentage'){
                        const discountPercent = totalamount*parseInt(existingProduct.discount?.discountValue)/100
                        console.log(discountPercent)
                        totalamount=totalamount- discountPercent
                        calculatedKhaltiData.push({
                            identity:product.productId,
                            name:discountPercent.toString(),
                            total_price:parseInt(totalamount),
                            quantity:product.quantity,
                            unit_price:existingProduct.price,
                          })
                     }
                     
                }
                totalAmount += totalamount;
            }
        }else{

            return { error: {
                msg:'Invalid existigData array'
            }};
        }
    }

    return {totalAmount,calculatedKhaltiData};
};
   