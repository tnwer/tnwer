const userModel = require('../Model/user');
const wishlistModel = require('../Model/wishlist');
const productModel = require('../Model/product');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
require('dotenv').config();

const schema = Joi.object({
    user_name : Joi.string().min(3).max(20).required(),
    user_email : Joi.string().email().required(),
    password : Joi.string().required(),
    phone_number : Joi.string().min(9).max(14).required()
});

function validation(user_name, user_email, password, phone_number){
const valid = schema.validate({user_name, user_email, password, phone_number});
    if (valid.error == undefined){
        return true;
    }else {
        return false;
    }
};

async function createUser(req, res){
  try {
    const { user_name, user_email, password, phone_number, user_location} = req.body;
    const valid = validation(user_name, user_email, password, phone_number);
    if (valid){
        let user_password = await bcrypt.hash(password, 10);
        try{
            const newUser = await userModel.create({
                user_name : user_name,
                user_email : user_email,
                password : user_password,
                user_location : user_location,
                user_role: 1,
                phone_number: phone_number || '07777777777',
                profile_img: 'https://firebasestorage.googleapis.com/v0/b/giftify-894d5.appspot.com/o/profile-default-icon-2048x2045-u3j7s5nj.png?alt=media&token=36c1eba1-4b08-429f-b03d-bcfcf8d58d73',
            });
            const accessToken = jwt.sign({id : newUser._id, role: newUser.user_role},
                                             process.env.SECRET_KEY, {expiresIn: '6h'});
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
            res.status(201).json({ accessToken });
        }catch(error){
            res.status(400).json("the Email is already exist!");
        }
    }else {
        console.log("Invalid inputs");
        res.status(400).json("Invalid inputs");
    }
  } catch (error) {
    console.log(error)
        res.status(500).json({ error: 'Error in user model createUser' });
  }
};

async function loginUser(req, res){
    try {
      const { user_email, password } = req.body;
      const valid = validation("userName", user_email, password, "12345678910");
      if (valid){
        const user = await userModel.findOne().where({user_email: user_email});
          if (user && user.user_email === user_email && user.user_role == 1) {
                bcrypt.compare(password , user.password, (error, result) => {
                    if (error) {
                        res.status(400).json(error);
                    } else if (result && user.is_deleted === false) {
                        const accessToken = jwt.sign({id : user._id, role : user.user_role},
                                                        process.env.SECRET_KEY, {expiresIn: '6h'});
                        res.cookie('accessToken', accessToken, { httpOnly: true });
                        res.status(200).json({ accessToken });
                    } else {
                        res.status(400).json('incorrect password');
                    }
                });
          }else {
            res.status(401).json({ error: 'Email not found' });
          }
      } else {
            res.status(400).json("Invalid inputs");
      }
    }catch (error) {
        res.status(500).json({ error: 'server error' });
    }
};

async function getUserData(req, res){
    try{
        const userID = req.user.id;
        const userData = await userModel.findById(userID);
        res.status(200).json(userData);
    }catch(error){
        res.status(500).json({error: 'error in get user data'});
    }
};

async function getAllUsers(req, res){
    try{
        const allUsers = await userModel.find().where({
            is_deleted: false,
        });
        res.status(200).json({users : allUsers});
    }catch(error){
        res.status(500).json({error: 'error in get user data'});
    }
};

async function getActiveUsers(req, res){
    try{
        const activeUsers = await userModel.find().where({
            login_status: true,
            is_deleted: false,
        });
        res.status(200).json({ activeUsers });
    }catch(error){
        res.status(500).json({error: 'error in get active Users'});
    }
};

async function updateUserData(req, res) {
    try {
        const userID = req.user.id;
        const { user_name, phone_number, user_location } = req.body;
        const user_image = res.locals.site || req.body.image;
        const theUser = await userModel.findByIdAndUpdate(userID, {
                user_name: user_name,
                phone_number: phone_number,
                profile_img: user_image,
                user_location: user_location,
            }, { new: true });
        theUser.save();
        res.status(200).json({ theUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Error in updating user data'});
    }
};

async function deleteUser(req, res){
    try{
        const userID = req.params.id;
        const deletedUser = await userModel.findById(userID);
        deletedUser.is_deleted = true;
        res.status(201).json({ deletedUser });
    }catch(error){
        console.log(error);
        res.status(500).json({error: "error in delete user"});
    }
};

async function addToWishlist(req, res){
    try{
        const userID = req.user.id;
        const productID = req.params.id;
        let wishlist = await wishlistModel.findOne({ user: userID });
        if (!wishlist) {
            wishlist = await wishlistModel.create({ user: userID, products: [] });
        }
        wishlist.products.push(productID);
        await wishlist.save();
        res.status(200).json({ message: 'Product added to wishlist successfully' });
    } catch(error) {
        console.error('Error in add to wishlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function getWishist(req, res){
    try{
        const userID = req.user.id;
        const wishlist = await wishlistModel.findOne().where({
            user: userID,
        });
        if(wishlist != null){
            const productIDs = wishlist.products;
            const products = await productModel.find({ _id: { $in: productIDs } });
            res.status(200).json(products);
        }else{
            res.status(200).json([]);
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'error in get wishlist'});
    }
};

async function deleteFromWishlist(req, res){
    try{
        const userID = req.user.id;
        const productID = req.params.id;
        const wishlist = await wishlistModel.findOne({ user: userID });
        if (wishlist) {
            const index = wishlist.products.indexOf(productID);
            if (index > -1) {
                wishlist.products.splice(index, 1);
                await wishlist.save();
                res.status(200).json({ message: 'Product removed from wishlist successfully' });
            } else {
                res.status(404).json({ error: 'Product not found in wishlist' });
            }
        } else {
            res.status(404).json({ error: 'Wishlist not found' });
        }
    } catch(error) {
        console.error('Error in delete from wishlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function createSeller(req, res){
    try {
      const { user_name, user_email, password, phone_number, user_location, Commercial_Record} = req.body;
      const valid = validation(user_name, user_email, password, phone_number);
      if (valid){
          let user_password = await bcrypt.hash(password, 10);
          try{
              const newUser = await userModel.create({
                  user_name : user_name,
                  user_email : user_email,
                  password : user_password,
                  user_location : user_location,
                  user_role: 2,
                  Commercial_Record: Commercial_Record,
                  phone_number: phone_number || '07777777777',
                  is_deleted: true,
                  profile_img: 'https://firebasestorage.googleapis.com/v0/b/giftify-894d5.appspot.com/o/profile-default-icon-2048x2045-u3j7s5nj.png?alt=media&token=36c1eba1-4b08-429f-b03d-bcfcf8d58d73'
              });
              const accessToken = jwt.sign({id : newUser._id, role: newUser.user_role}, process.env.SECRET_KEY, {expiresIn: '6h'});
              res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
              res.status(201).json({ accessToken });
          }catch(error){
              res.status(400).json("the Email is already exist!");
          }
      }else {
          console.log("Invalid inputs");
          res.status(400).json("Invalid inputs");
      }
    } catch (error) {
      console.log(error)
          res.status(500).json({ error: 'Error in user model createUser' });
    }
};

async function loginSeller(req, res){
    try {
      const { user_email, password } = req.body;
      const valid = validation("userName", user_email, password, "12345678910");
      if (valid){
        const user = await userModel.findOne().where({user_email: user_email});
          if (user && user.user_email === user_email && user.user_role == 2) {
                bcrypt.compare(password , user.password, (error, result) => {
                    if (error) {
                        res.status(400).json(error);
                    } else if (result && user.is_deleted === false) {
                        const accessToken = jwt.sign({id : user._id, role : user.user_role}, process.env.SECRET_KEY, {expiresIn: '6h'});
                        res.cookie('accessToken', accessToken, { httpOnly: true });
                        res.status(200).json({ accessToken });
                    } else {
                        res.status(400).json('incorrect password or your account still not active');
                    }
                });
          }else {
            res.status(401).json({ error: 'Email not found' });
          }
      } else {
            res.status(400).json("Invalid inputs");
      }
    }catch (error) {
        res.status(500).json({ error: 'server error' });
    }
};

async function loginAdmin(req, res){
    try {
      const { email, password } = req.body;
      const valid = validation("userName", email, password, "12345678910");
      if (valid){
        const user = await userModel.findOne().where({user_email: email});
          if (user && user.user_email === email && user.user_role == 3) {
                bcrypt.compare(password , user.password, (error, result) => {
                    if (error) {
                        res.status(400).json(error);
                    } else if (result && user.is_deleted === false) {
                        const accessToken = jwt.sign({id : user._id, role : user.user_role},
                                                         process.env.SECRET_KEY, {expiresIn: '4h'});
                        res.cookie('accessToken', accessToken, { httpOnly: true });
                        res.status(200).json({ accessToken });
                    } else {
                        res.status(400).json('incorrect password');
                    }
                });
          }else {
            res.status(401).json({ error: 'Email not found' });
          }
      } else {
            res.status(400).json("Invalid inputs");
      }
    }catch (error) {
        res.status(500).json({ error: 'server error' });
    }
};

async function loginUser(req, res){
    try {
      const { user_email, password } = req.body;
      const valid = validation("userName", user_email, password, "12345678910");
      if (valid){
        const user = await userModel.findOne().where({user_email: user_email});
          if (user && user.user_email === user_email && user.user_role == 1) {
                bcrypt.compare(password , user.password, (error, result) => {
                    if (error) {
                        res.status(400).json(error);
                    } else if (result && user.is_deleted === false) {
                        const accessToken = jwt.sign({id : user._id, role : user.user_role},
                                                     process.env.SECRET_KEY, {expiresIn: '6h'});
                        res.cookie('accessToken', accessToken, { httpOnly: true });
                        res.status(200).json({ accessToken });
                    } else {
                        res.status(400).json('incorrect password');
                    }
                });
          }else {
            res.status(401).json({ error: 'Email not found' });
          }
      } else {
            res.status(400).json("Invalid inputs");
      }
    }catch (error) {
        res.status(500).json({ error: 'server error' });
    }
};

async function createAdmin(req, res){
    try {
      const { user_name, user_email, password, phone_number, user_location, Commercial_Record} = req.body;
      const valid = validation(user_name, user_email, password, phone_number);
      if (valid){
          let user_password = await bcrypt.hash(password, 10);
          try{
              const newUser = await userModel.create({
                  user_name : user_name,
                  user_email : user_email,
                  password : user_password,
                  user_location : user_location,
                  user_role: 3,
                  phone_number: phone_number || '07777777777',
                  profile_img: 'https://firebasestorage.googleapis.com/v0/b/giftify-894d5.appspot.com/o/profile-default-icon-2048x2045-u3j7s5nj.png?alt=media&token=36c1eba1-4b08-429f-b03d-bcfcf8d58d73'
              });
              const accessToken = jwt.sign({id : newUser._id, role: newUser.user_role},
                                             process.env.SECRET_KEY, {expiresIn: '6h'});
              res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
              res.status(201).json({ accessToken });
          }catch(error){
              res.status(400).json("the Email is already exist!");
          }
      }else {
          console.log("Invalid inputs");
          res.status(400).json("Invalid inputs");
      }
    } catch (error) {
      console.log(error)
          res.status(500).json({ error: 'Error in user model createUser' });
    }
};

async function acceptSeller(req, res){
    try{
        const sellerID = req.params.id;
        const acceptedSeller = await userModel.findById(sellerID);
        acceptedSeller.is_deleted = false;
        acceptedSeller.save();
        res.status(201).json(acceptedSeller);
    }catch(error){
        console.log(error);
        res.status().json({error: "error in accept seller"});
    }
};

async function getSellersRequests(req, res){
    try{
        const sellersRequests = await userModel.find().where({
            is_deleted: true,
        });
        res.status(200).json(sellersRequests);
    }catch(error){
        console.log(error);
        res.status(500).json({error: "error in get Sellers Requests"})
    }
};

async function updateUserPassword(req, res) {
    try {
        const userID = req.user.id;
        const { newPassword, userPassword } = req.body;
        if (!newPassword || !userPassword) {
            return res.status(400).json({ error: "New password and current password are required" });
        }
        let user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.password) {
            return res.status(400).json({ error: "User password is not set" });
        }
        let isMatch = bcrypt.compare(userPassword , user.password, (error, result) => {
            if (error) {
                return false;
            } else if (result && user.is_deleted === false) {
                return true;
            } else {
                return false;
            }
        });
        if (isMatch == false) {
            return res.status(400).json({ error: "Incorrect password" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        await user.save();
        res.status(201).json("Password changed successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in changing the user password" });
    }
};

module.exports = {
    createUser,
    loginUser,
    getUserData,
    getAllUsers,
    getActiveUsers,
    deleteUser,
    updateUserData,
    addToWishlist,
    getWishist,
    deleteFromWishlist,
    createSeller,
    loginSeller,
    loginAdmin,
    createAdmin,
    acceptSeller,
    getSellersRequests,
    updateUserPassword,
};