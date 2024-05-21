const productModel = require('../Model/product');
const userModel = require('../Model/user');
const categoryModel = require('../Model/category');
const discountModel = require('../Model/discount'); 

async function addProduct(req, res){
    try{
        const userID = req.user.id;
        const user_img = res.locals.site;
        const {product_name, description, price, product_category,
                product_count, product_location, shop_name} = req.body;
        const owner = await userModel.findById(userID);
        const category = await categoryModel.findOne({ category_name: product_category });
        const newProduct = await productModel.create({
            product_name: product_name,
            description: description,
            price: price,
            product_category: category,
            img_url: user_img,
            product_count: product_count,
            product_owner: userID,
            product_location: product_location,
            shop_name: shop_name,
        });
        newProduct.save();
        res.status(201).json(newProduct);
    }catch(error){
        console.log(error);
        res.status(500).json({error: "error in add Product"});
    }
};

async function getAllProducts(req, res) {
    try {
        const allProducts = await productModel.find({
            is_deleted: false,
            product_count: { $gt: 0 }
        }).populate('product_category').populate('discount');
        
        res.status(200).json(allProducts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error in get All Products" });
    }
};

async function getProductDetails(req, res) {
    try {
        const productID = req.params.id;
        const productDetails = await productModel.findById(productID).where({
            is_deleted: false,
        }).populate('product_category').populate('discount').populate({
            path: 'comments',
            populate: {
                path: 'comment_user',
                model: 'User'
            }
        });

        const userID = req.headers.user || null;
        let location;
        if (userID) {
            let user = await userModel.findById(userID);
            location = user.user_location;
        } else {
            location = productDetails.product_location;
        }

        const price = productDetails.price;
        const productName = productDetails.product_name;
        const productNameWords = productName.split(' ');
        const productNameRegexArray = productNameWords.map(word => new RegExp(word, 'i'));

        const relatedProducts = await productModel.find({
            product_category: productDetails.product_category,
            _id: { $ne: productDetails._id },
            price: { $lt: price },
            is_deleted: false,
            // product_location: location,
        }).sort({ price: 1 }).limit(8);

        let bestOfProduct = await productModel.find({
            product_category: productDetails.product_category._id,
            _id: { $ne: productDetails._id },
            price: { $lt: price },
            is_deleted: false,
            $or: productNameRegexArray.map(regex => ({ product_name: regex }))
        }).sort({ price: 1 }).limit(8);

        if(bestOfProduct.length == 0){
            bestOfProduct = await productModel.find({
                product_category: productDetails.product_category._id,
                _id: { $ne: productDetails._id },
                // price: { $lt: price },
                is_deleted: false,
                $or: productNameRegexArray.map(regex => ({ product_name: regex }))
            }).sort({ price: 1 }).limit(8);
        }

        res.status(200).json({ productDetails, relatedProducts, bestOfProduct, userID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in get Details" });
    }
};

async function updateProduct(req, res){
    try{
        const productID = req.params.id;
        const productImg = res.locals.site;
        const {product_name, description, price, product_category, shop_name,
                 product_count, product_location, 
        } = req.body;
        const updatedProduct = await productModel.findByIdAndUpdate(productID, {
            product_name: product_name, 
            description: description,
            price: price,
            product_category: product_category,
            img_url: productImg,
            shop_name: shop_name,
            product_count: product_count,
            product_location: product_location,
        });
        updatedProduct.save();
        res.status(201).json(updatedProduct);
    }catch(error){
        console.log(error);
        res.status(500).json({error: "error in update Product"});
    }
};

async function deleteProduct(req, res){
    try{
        const productID = req.params.id;
        const deletedPrdouct = await productModel.findById(productID);
        deletedPrdouct.is_deleted = true;
        deletedPrdouct.save();
        res.status(201).json(deleteProduct);
    }catch(error){
        console.log(error);
        res.status(500).json({error: "error in add To Oreders"});
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
        res.status(500).json({error: "error in add discount"});
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

async function getSellerProducts(req, res){
    try{
        const userID = req.user.id;
        const productDetails = await productModel.find().where({
            is_deleted: false,
            product_owner: userID,
        }).populate('product_category').populate('discount').populate({
                path: 'comments',
                populate: {
                    path: 'comment_user',
                    model: 'User'
            }});
        res.status(200).json(productDetails);
    }catch(error){
        console.log(error);
        res.status(500).json('error in get Seller Products');
    }
};

async function deletedProducts(req, res){
    try{
        const DeletedProducts = await productModel.find().where({
            is_deleted: true,
        });
        res.status(200).json(DeletedProducts);
    }catch(error){
        console.log(error);
        res.status(500).json('error in get deleted Products');
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
    addDiscount,
    deleteDiscount,
    getSellerProducts,
    deletedProducts
};
