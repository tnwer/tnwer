const express = require('express');
const router = express.Router();
const productControllers = require('../Controllers/productsController');
const categoryController = require('../Controllers/categoryController');
const userAuth = require('../Middlewares/userAuth');
const sellerAuth = require('../Middlewares/sillerAuth');
const uploadImg = require('../Middlewares/imgUpload');

router.post('/addProduct', sellerAuth.authorize, uploadImg.uploadImg, productControllers.addProduct);
router.get('/allProducts', productControllers.getAllProducts);
router.get('/productDetails/:id', productControllers.getProductDetails);
router.put('/updateProduct/:id', sellerAuth.authorize, uploadImg.uploadImg, productControllers.updateProduct);
router.put('/deleteProduct/:id', userAuth.authorize, productControllers.deleteProduct);

router.post('/addDiscount/:id', sellerAuth.authorize, productControllers.addDiscount);
router.put('/deleteDescount/:id', sellerAuth.authorize, productControllers.deleteDiscount);

router.get('/getCategory', categoryController.getCategory);
router.post('/addCategory', uploadImg.uploadImg, categoryController.addCategory);

router.get('/getSellerProducts', sellerAuth.authorize, productControllers.getSellerProducts);

module.exports = router;