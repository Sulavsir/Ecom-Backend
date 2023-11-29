const Category = require('../../models/categories/categories')
const {isValid} = require('mongoose').Types.ObjectId;
function map_categories(newCategories, categories) {
    if (newCategories.categorie) {
        categories.categorie = newCategories.categorie;
    }
    
    if (newCategories.subCategories) {
        categories.subCategories = newCategories.subCategories.map(subCategory => ({
            name: subCategory.name
        }));
    }
}


function insert (data){
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

function update(data,id){
    return Category.findOne(id)
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


module.exports ={
    insert,
    findAll,
    update,
    removeMultipleCategories
}