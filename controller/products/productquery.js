const productSchema = require('../../models/product/productSchema');

function map_product_req(productData, product) {
    if (productData.updatedBy)
    product.updatedBy = productData.updatedBy;
  if (productData.description)
    product.description = productData.description;
  if (productData.category)
    product.category = productData.category;
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
function find(condition) {

  return productSchema
    .find(condition)
    .sort({
      _id: -1
    })
    .populate('createdBy', { username: 1, email: 1 })
    .populate('ratings.user', { username: 1 })
    .exec();
}

function insert(data) {

  // validate data
  // map data
  let newproduct = new productSchema({});
  map_product_req(data, newproduct)
  // return new Promise(function (resolve, reject) {
  //   then(function (data) {
  //     resolve(data)
  //   })
  //     .catch(function (err) {
  //       reject(err)
  //     })
  // })
  return newproduct.save();

}
function update(data, productId) {
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

function addRatings(data, productId) {
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
  
  


module.exports = {
  find,
  insert,
  update,
  remove,
  addRatings
}