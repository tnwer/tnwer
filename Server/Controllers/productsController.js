const productModel = require('../Model/product');
const userModel = require('../Model/user');
const categoryModel = require('../Model/category');
const discountModel = require('../Model/discount'); 

async function addProduct(req, res){
    try{
        const userID = '66350f9c54f679aba589a1ee';
        const user_img = res.locals.site;
        const {product_name, description, price, product_category, product_count, product_location} = req.body;
        const owner = await userModel.findById(userID);
        const category = await categoryModel.findOne({ category_name: product_category });
        const newProduct = await productModel.create({
            product_name: product_name,
            description: description,
            price: price,
            product_category: category,
            img_url: user_img,
            product_count: product_count,
            product_owner: owner,
            product_location: product_location,
        });
        res.status(201).json(newProduct);
    }catch(error){
        res.status(500).json("error in add Product");
    }
};

async function getAllProducts(req, res){
    try{
        const allProducts = await productModel.find().where({
            is_deleted: false,
        }).populate('product_category').populate('discount');
        res.status(200).json(allProducts);
    }catch(error){
        console.log(error);
        res.status(500).json("error in get All Products");
    }
};

async function getProductDetails(req, res){
    try{
        const productID = req.params.id;
        const product = await productModel.findById(productID).where({
            is_deleted: false,
        }).populate('product_category').populate('discount');
        res.status(200).json(product);
    }catch(error){
        console.log(error);
        res.status(500).json("error in get Details");
    }
};

async function updateProduct(req, res){
    try{
        
    }catch(error){
        console.log(error);
        res.status(500).json("error in update Product");
    }
};

async function deleteProduct(req, res){
    try{
        const productID = req.params.id;
        const deletedPrdouct = await productModel.findById(productID);
        deletedPrdouct.is_deleted = true;
        res.status(201).json(deleteProduct);
    }catch(error){
        console.log(error);
        res.status(500).json("error in add To Oreders");
    }
};

async function addDiscount(req, res) {
    try {
        const productID = req.params.id;
        const { percentage, start_date, end_date } = req.body;
        const discount = await discountModel.create({
            product: productID,
            percentage: percentage,
            start_date: start_date,
            end_date: end_date,
        });
        const product = await productModel.findById(productID);
        product.discount = discount;
        await product.save();
        res.status(201).json(discount);
    } catch (error) {
        console.log(error);
        res.status(500).json("error in add discount");
    }
};

async function deleteDiscount(req, res){
    try{
        const productID = req.params.id;
        const productDiscounts = await discountModel.find({ product: productID });
        for (const discount of productDiscounts) {
            await discount.deleteOne();
        }
        res.status(201).json({ message: 'Discounts deleted successfully' });
    } catch(error){
        console.log(error);
        res.status(500).json({ error: 'Error in deleting discounts' });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
    addDiscount,
    deleteDiscount,
};
