const { result } = require('lodash');
const productSchema = require('../../models/product/productSchema');
const {isValid} = require('mongoose').Types.ObjectId;
function map_product_req(productData, product) {
    if (productData.updatedBy)
    product.updatedBy = productData.updatedBy;
  if (productData.description)
    product.description = productData.description;
  if (productData.category)
    product.category = productData.category;
  if (productData.subCategoryId)
    product.subCategoryId = productData.subCategoryId;
  if (productData.color)
    product.color = productData.color;
  if (productData.price)
    product.price = productData.price;
  if (productData.status)
    product.status = productData.status;
  if (productData.modelNo)
    product.modelNo = productData.modelNo;
  if (productData.size)
  product.size = typeof (productData.size) === 'string' ? productData.size.split(',') : productData.size;
  if (productData.brand)
    product.brand = productData.brand;
  if (productData.salesQuantity)
    product.salesQuantity = productData.salesQuantity;
    if (productData.quantity)
    product.quantity = productData.quantity;
  if (productData.images)
    product.images = productData.images;
  if (productData.purchasedDate)
    product.purchasedDate = productData.purchasedDate;
  if (productData.salesDate)
    product.salesDate = productData.salesDate;
  if (productData.returnedDate)
    product.returnedDate = productData.returnedDate;
  if (productData.tags)
    product.tags = typeof (productData.tags) === 'string' ? productData.tags.split(',') : productData.tags
  if (productData.createdBy)
    product.createdBy = productData.createdBy;
  if (productData.isReturnEligible)
    product.isReturnEligible = productData.isReturnEligible;
  if (productData.warrentyStatus)
    product.warrentyStatus = productData.warrentyStatus;
  if (productData.warrentyPeriod)
    product.warrentyPeriod = productData.warrentyPeriod;
  if (!product.discount)
    product.discount = {};
  if (productData.discountedproduct)
    product.discount.discountedproduct = productData.discountedproduct;
  if (productData.discountType)
    product.discount.discountType = productData.discountType;
  if (productData.discountValue)
    product.discount.discountValue = productData.discountValue;
}

/**
 * find form database
 * @param {object} condition 
 * @returns Promise
 */
function find(condition){

  return productSchema
    .find(condition)
    .sort({
      _id: -1
    })
    .populate('createdBy', { username: 1, email: 1 })
    .populate('ratings.user', { username: 1 })
    .exec();
}

function insert(data) 
{

  let newproduct = new productSchema({});
  map_product_req(data, newproduct)
  
  return newproduct.save();

}
async function update(data, productId) {
    console.log('data >>', data);
    console.log('type of data .filetoremove', typeof data.filesToRemove);
  
    return productSchema.findById(productId)
      .then((product) => {
        if (!product) {
          throw {
            msg: 'Product Not Found',
            status: 404
          };
        }
  
        // Assign the newImages directly to the images property
        product.images = data.newImages;

  
        // To remove existing images
        if (data.filesToRemove) {
          const removing_files = data.filesToRemove.split(',');
          removing_files.forEach((product) => {
            if (product.images.includes(product)) {
              product.images.splice(product.images.indexOf(product), 1);
            }
          });
        }
  
        map_product_req(data, product);
  
        return product.save();
      })
      .catch((err) => {
        throw err;
      });
  }
  

function remove(id) {
  return productSchema.findByIdAndRemove(id);
}

async function addRatings(data, productId) {
    return productSchema.findById(productId)
      .then((product) => {
        if (!product) {
          return Promise.reject({
            msg: 'Product not found',
            status: 404
          });
        }
        console.log('Data received:', data);
    
          product.ratings.push(data);
        return product.save();
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
  
  async function removeAllItems(ids){
   try {
       if(ids === undefined){
           throw {msg:'no ids'}
        }
        const { validIds, invalidIds } = ids.reduce(
            (acc, id) => {
                if (isValid(id)) {
                    acc.validIds.push(id);
                } else {
                    acc.invalidIds.push(id);
                }
                return acc;
            },
            { validIds: [], invalidIds: [] }
        );
        const product = await productSchema.updateMany(
            { _id: { $in: validIds } },
            { $set: { isRemoved: true } }
        );
        console.log('product-->',product)
        if(product.modifiedCount === 0){
            console.log('errro')
          throw {msg: 'Products not found .Please enter  correct ids'  };
        }
        return product
   } catch (error) {
    throw { msg:error };
   }
  }

   

module.exports = {
  find,
  insert,
  update,
  remove,
  addRatings,
  removeAllItems,
  

}