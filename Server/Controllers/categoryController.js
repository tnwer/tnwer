const categoryModel = require('../Model/category');

async function getCategory(req, res){
    try{
        const category = await categoryModel.find();
        res.status(200).json(category);
    }catch(error){
        console.log(error);
        res.status(500).json('error in get category');
    }
};

async function addCategory(req, res){
    try{
        const {category_name} = req.body;
        const category_img = res.locals.site;
        const newCategory = await categoryModel.create({
            category_name: category_name,
            category_img: category_img,
        });
        res.status(201).json(newCategory);
    }catch(error){
        console.log(error);
        res.status(500).json('error in add category');
    }
};

async function deleteCategory(req, res){
    try{
        const categoryID = req.params.id;
        const deletedCategory = await categoryModel.deleteOne().where({
            _id: categoryID,
        });
        res.status(201).json(deletedCategory);
    }catch(error){
        console.log(error);
        res.status(500).json('error in deleteC ategory');
    }
}

module.exports = {
    getCategory,
    addCategory,
    deleteCategory
}