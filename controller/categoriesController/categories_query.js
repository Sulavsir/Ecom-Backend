const { result } = require('lodash');
const Category = require('../../models/categories/categories')
const {isValid} = require('mongoose').Types.ObjectId;
function map_categories(newCategories, categories) {
    if (newCategories.category) {
        categories.category = newCategories.category;
    }
    
    if (newCategories.subCategories) {
        categories.subCategories = newCategories.subCategories.map(subCategory => ({
            name: subCategory.name
        }));
    }
}


function insert (data){
    console.log('req.body',data)
    let Categories = new Category({})
map_categories(data,Categories)
return Categories.save()

}

function findAll(condition){
return Category
.find(condition)
.sort({
    _id:-1
})
}
// for update subcategory
async function updateSubcategory(categoryId, subCategoryId, data) {
    try {
        if (categoryId === undefined || subCategoryId === undefined) {
            throw { msg: 'Id cannot be empty' };
        }

        const updatesubcategory = await Category.findOneAndUpdate(
            { _id: categoryId, 'subCategories._id': subCategoryId },
            { $set: { 'subCategories.$.name': data.name } },
            { new: true }
        );

        if (!updatesubcategory) {
            throw { msg: 'Unable to update' };
        }

        return updatesubcategory;
    } catch (error) {
        throw { msg: error };
    }
}


function update(data,id){
    if(id === undefined){
        throw({msg:'id cannt be null'})
    }
    console.log('id--->',id)
    
    return Category.findOne({_id:id})
    .then((categories)=>{
        if(!categories){
            throw ({msg:'no such categories'})
        }
        map_categories(data,categories)
        return categories.save()
    })
    .catch((error)=>{
        console.log('error from update categories')
        throw ({msg:error})
    })
}

async function removeMultipleCategories(ids) {
    try {
        if (ids === undefined) {
            throw { msg: 'Information cannot be empty' };
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

        if (validIds.length === 0) {
            throw { msg: 'Invalid IDs' };
        }

        const result = await Category.deleteMany(
            { _id: { $in: validIds } }
        );

        if (result.deletedCount === 0) {
            throw { msg: 'categoried already deleted' };
        }

        return result;
    } catch (error) {
        throw { msg: error };
    }
}


async function deleteSubCategory(categoryId,subCategoryId){
   
    try {
        if(categoryId ===undefined || subCategoryId===undefined){
            throw({msg:'Id cannt be empty'})
        } 

       await Category.updateOne({_id:categoryId},
            {$pull:{subCategories:{_id:subCategoryId}}}
            )
            .then((result)=>{
                if(result.modifiedCount===0){
                    throw({msg:'unable to delete subcategory'})
                }
                return result
            })
            .catch((error)=>{
                throw({msg:'error while delete',error})
            })
    } catch (error) {
        throw({msg:error})
    }
}

module.exports ={
    insert,
    findAll,
    update,
    removeMultipleCategories,
    deleteSubCategory,
    updateSubcategory
} 