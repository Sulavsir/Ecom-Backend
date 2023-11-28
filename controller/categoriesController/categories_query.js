const Category = require('../../models/categories/categories')

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
//     console.log('data',data)
// if(data.id){
 
// }
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


module.exports ={
    insert,
    findAll,
    update
}