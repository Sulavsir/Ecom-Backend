const categoriesQuery = require('./categories_query');
// for insertion of category
async function insertion(req, res, next) {
    try {
        let data = req.body;
        console.log('data---->',data)
        console.log(data.subCategories)
        let condition = {};
        const existingCategories = await categoriesQuery.findAll(condition);
        console.log('existingCategories', existingCategories);

        const existingCategory = existingCategories.find(category => category.category === data.category);

        if (existingCategory) {
            console.log('data.subCategories:', data.subCategories);
            console.log('existingCategory.subCategories:', existingCategory.subCategories);
        
            for (const newSubCategory of data.subCategories) {
                const existingSubCategory = existingCategory.subCategories.find(subCategory => {
                    if (typeof subCategory === 'string') {
                        // Check if the name matches the string
                        return subCategory === newSubCategory.name;
                    } else if (typeof subCategory === 'object' && subCategory.name) {
                        // Check if the name property of the object matches
                        return subCategory.name === newSubCategory.name;
                    }
                    return false;
                });
        
                if (existingSubCategory) {
                    return res.json(`Subcategory '${newSubCategory.name}' already exists. Please add a new one.`);
                }
        
                // If subcategory doesn't exist, add it to the existing category
                existingCategory.subCategories.push({ name: newSubCategory.name });
            }
        
            await existingCategory.save(); // Assuming your model has a save method
        
            return res.json({
                msg: 'Subcategories added to the existing category',
                existingCategory
            });
        }
        

        // Category doesn't exist, proceed with insertion
        await categoriesQuery.insert(data);

        return res.json({
            msg: 'Category added successfully',
            success: true
        });
    } catch (error) {
        next(error);
    }
}
// update subcategory
async function updateSubcategory(req,res,next){
    try {
        const data = req.body;
        const {categoryId,subCategoryId}=req.query
        const updateSubcategory = await categoriesQuery.updateSubcategory(categoryId,subCategoryId,data)
        if(!updateSubcategory){
        return res.status(400).json({
            msg:'unable to update'
        })
        }
        return res.status(200).json({
            msg: 'Subcategory updated successfully',
            data:updateSubcategory
        })
    } catch (error) {
        next(error)
    }
    }

// for update category
async function updateCategory(req,res,next){
    const data=req.body
    const id=req.query.id
    let existingCategories;
    try {
      existingCategories = await categoriesQuery.update(data,id)
     existingCategories.category = data.category 
     console.log('existingCategories',existingCategories)  
     return res.status(200).json({
        msg: 'Category updated successfully',
        existingCategories,
    });
     
    } catch (error) {
        next(error)
    }
}
// for delete category
async function removeMultipleCategories(req, res, next) {
    const ids = req.body.ids;
    try {
        await categoriesQuery.removeMultipleCategories(ids);
        res.status(200).json({
            msg: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

//for delete subCategory
async function removeSubcategory(req, res, next) {
    const { categoryId, subCategoryId } = req.query;
    try {
     const result=   await categoriesQuery.deleteSubCategory(categoryId, subCategoryId)
        res.status(200).json({
            msg: 'Subcategory deleted successfully'
        });
    } catch (error) {
        next(error); 
    }
}




module.exports={
    insertion,
    removeMultipleCategories,
    updateCategory,
    removeSubcategory,
    updateSubcategory

}