const express = require('express');
const router = express.Router();
const userControllers = require('../Controllers/userController');
const userAuth = require('../Middlewares/userAuth');
const adminAuth = require('../Middlewares/adminAuth');
const uploadImg = require('../Middlewares/imgUpload');

router.post('/adminRegister', userControllers.createAdmin);
router.post('/adminLogin', userControllers.loginAdmin);

router.post('/sellerLogin', userControllers.loginSeller);
router.post('/sellerSignUp', userControllers.createSeller);

router.post('/userLogin', userControllers.createUser);
router.post('/userRegister', userControllers.loginUser);

router.get('/allUsers', userControllers.getAllUsers);
router.get('/profilePage', userAuth.authorize, userControllers.getUserData);
router.get('/activeUsers', adminAuth.authorize, userControllers.getActiveUsers);
router.put('/updateUser', userAuth.authorize, uploadImg.uploadImg, userControllers.updateUserData);
router.put('/updatePassword', userAuth.authorize, userControllers.updateUserPassword)
router.put('/deleteUser/:id', userAuth.authorize, userControllers.deleteUser);

router.get('/wishlist', userAuth.authorize, userControllers.getWishist);
router.post('/addToWishlist/:id', userAuth.authorize, userControllers.addToWishlist);
router.delete('/deleteFromWishlist/:id', userAuth.authorize, userControllers.deleteFromWishlist);

router.put('/sellerAccept/:id', adminAuth.authorize, userControllers.acceptSeller);
router.get('/sellersRequests', userControllers.getSellersRequests);

module.exports = router;