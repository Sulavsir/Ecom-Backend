const categoriesQuery = require('./categories_query')

async function insertion(req, res, next) {
    try {
        let data = req.body;
        console.log('data',data)
        console.log(data.subCategories)
        let condition = {};
        const existingCategories = await categoriesQuery.findAll(condition);
        console.log('existingCategories', existingCategories);

        const existingCategory = existingCategories.find(category => category.categorie === data.categorie);

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




module.exports={
    insertion
}