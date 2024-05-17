const ratingModel = require('../Model/rating');
const commentModel = require('../Model/comment');
const paymentModel = require('../Model/payment');
const productModel = require('../Model/product');

async function addRating(req, res){
    try{
        const userID = '66350f9c54f679aba589a1ee';
        const productID = req.params.id;
        const {userRating} = req.body;

        const userPayment = await paymentModel.find().where({
            payment_user_id: userID,
            product_id: productID,
        });

        if(userPayment.length > 0){
            const findRating = await ratingModel.find().where({
                rating_on: productID,
                rating_user: userID
            });
            
            if(findRating.length > 0){
                res.status(401).json('you have rate this product before');
            }else{
                const rating = await ratingModel.create({
                    rating_on: productID,
                    rating: userRating,
                    rating_user: userID
                });
                await rating.save();
                const allRatingOnTheProduct = await ratingModel.find().where({
                    rating_on: productID
                });
                let productRatings = 0;

                for(let i = 0; i < allRatingOnTheProduct.length; i++){
                    productRatings = productRatings + allRatingOnTheProduct[i].rating;
                }
                productRatings = productRatings / allRatingOnTheProduct.length;
                console.log(productRatings, allRatingOnTheProduct.length);
                const updateProductRating = await productModel.findByIdAndUpdate(
                    productID,
                    { rating: productRatings },
                    { new: true }
                );
                await updateProductRating.save();
                res.status(201).json({rating, updateProductRating});
            }
        }else{
            res.status(401).json('you dont puy this product to make a rating');
        }
    }catch(error){
        console.log(error);
        res.status(500).json('error in add rating');
    }
};

async function addComment(req, res){
    try{
        const userID = '66350f9c54f679aba589a1ee';
        const productID = req.params.id;
        const {userComment} = req.body;
        const newComment = await commentModel.create({
            comment_on: productID,
            comment: userComment,
            comment_user: userID
        });
        await newComment.save();
        res.status(201).json(newComment);
    }catch(error){
        console.log(error);
        res.status(500).json('error in add comment');
    }
};

module.exports = {
    addRating,
    addComment
};