const cartModel = require('../Model/cart');
const productModel = require('../Model/product');

async function getCartInfo(req, res){
    try{
        const userID = req.user.id;
        const userCart = await cartModel.find({
            cart_user_id: userID,
            is_deleted: false,
            is_payed: false,
        });
        res.status(200).json(userCart);
    }catch(error){
        console.log(error);
        res.status(500).json({error: "error in get Cart Info"});
    }
};

async function cartIncrement(req, res){
    try{
        const userID = req.user.id;
        const productID = req.params.id;
        const theProduct = await productModel.findById(productID);
        const productInCart = await cartModel.findOne().where({
            cart_user_id: userID,
            cart_product: theProduct._id,
            is_deleted: false,
            is_payed: false,
        });
        if (productInCart && productInCart.quantity >= 1 && productInCart.quantity < theProduct.product_count){
            productInCart.quantity++;
            await productInCart.save();
            res.status(201).json('you have incerement the product in cart');
        }else if(!productInCart){
            const productInCart = await cartModel.create({
                cart_user_id: userID,
                cart_product: theProduct._id,
                quantity: 1,
                is_deleted: false,
                is_payed: false,
            });
            productInCart.save();
            res.status(201).json('you have incerement the product in cart');
        }else{
            res.status(401).json('you have the maximum number for the product');
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: "error in cart Increment"});
    }
};

async function cartDecrement(req, res){
    try{
        const userID = req.user.id;
        const productID = req.params.id;
        const theProduct = await productModel.findById(productID);
        const productInCart = await cartModel.findOne().where({
            cart_user_id: userID,
            cart_product: theProduct._id,
            is_deleted: false,
            is_payed: false,
        });
        if (productInCart && productInCart.quantity > 1){
            productInCart.quantity--;
            productInCart.save();
            res.status(201).json('you have Decrement the product in cart');
        }else if(productInCart && productInCart.quantity == 1){
            productInCart.is_deleted = true;
            productInCart.save();
            res.status(201).json('you have Decrement the product in cart');
        }else{
            res.status(401).json('you have the minimum number for the product');
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: "error in cart Decrement"});
    }
};

module.exports = {
    getCartInfo,
    cartIncrement,
    cartDecrement,
};