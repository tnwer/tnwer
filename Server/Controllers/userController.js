const userModel = require('../Model/user');
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

async function createUser (req, res){
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

async function loginUser (req, res){
    try {
      const { user_email, password } = req.body;
      const valid = validation("userName", user_email, password, "12345678910");
      if (valid){
        const user = await userModel.findOne().where({user_email: user_email});
        console.log(user);
          if (user && user.user_email === user_email) {
                bcrypt.compare(password , user.password, (error, result) => {
                    if (error) {
                        res.status(400).json(error);
                    } else if (result) {
                        const accessToken = jwt.sign({id : user._id, role : user.user_role}, process.env.SECRET_KEY, {expiresIn: '6h'});
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
        res.status(500).json('error in get user data');
    }
};

async function getAllUsers(req, res){
    try{
        const allUsers = await userModel.find().where({
            is_deleted: false,
        });
        res.status(200).json({users : allUsers});
    }catch(error){
        res.status(500).json('error in get user data');
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
        res.status(500).json('error in get active Users');
    }
};

async function updateUserData(req, res) {
    try {
        const userID = req.params.id;
        const { user_name, password, phone_number } = req.body;
        const user_image = res.locals.site || null;
        let theUser = await userModel.findById(userID);
        bcrypt.compare(password, theUser.password, async (error, result) => {
            if (error) {
                res.status(400).json(error);
            } else if (result) {
                theUser = await userModel.findByIdAndUpdate(userID, {
                    user_name: user_name,
                    phone_number: phone_number,
                    profile_img: user_image, 
                }, { new: true });
                theUser.save();
                res.status(200).json({ theUser });
            } else {
                res.status(400).json('Incorrect password');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json('Error in updating user data');
    }
};

async function deleteUser(req, res){
    try{
        const userID = req.params.id;
        console.log(userID);
        const deletedUser = await userModel.findById(userID);
        deletedUser.is_deleted = true;
        console.log(deletedUser);
        res.status(201).json({ deletedUser });
    }catch(error){
        console.log(error);
        res.status(500).json("error in delete user");
    }
};

// async function updateUserImage(req, res){
//     try{
//         const userID = req.user.id;
//         const user_img = res.locals.site;
//         const updateUser = await Users.findByPk(userID);
//         await updateUser.update({user_img: user_img});
//         res.status(201).json(updateUser);
//     }catch(error){
//         console.log(error);
//         res.status(500).json('error in update User Image controller');
//     }
// };

module.exports = {
    createUser,
    loginUser,
    getUserData,
    getAllUsers,
    getActiveUsers,
    deleteUser,
    updateUserData,
    // getWishlist,
    // gitOrderHistory,
    // deleteOrder,
    // updateUserImage,
};

// async function getWishlist(req, res){
//     try{
//         const userID = req.user.id;
//         const wishlist = await Wishlist.findAll({
//             where: {
//                 user_wishlist_id: userID,
//             },
//             include: [
//                 {
//                     model: Products,
//                     attributes: ['product_id', 'product_name', 'description', 'price', 'product_rating', 'img_url'],
//                 },
//             ],
//         });
//         res.status(200).json(wishlist);
//     }catch(error){
//         console.log(error)
//         res.status(500).json('error in get wishlist');
//     }
// };

// async function gitOrderHistory(req, res) {
//     try {
//         const userID = req.user.id;
//         const ordersHistory = await Order.findAll({
//             where: {
//                 user_order_id: userID,
//                 is_payed: true,
//             },
//             include: [
//                 {
//                     model: Products,
//                     as: "product",
//                     attributes: ['product_id', 'product_name', 'price', 'product_rating', 'img_url', 'description'],
//                 },
//                 {
//                     model: Recipient,
//                     as: "recipient",
//                     attributes: ['recipient_name', 'recipient_location', 'recipient_phone_number'],
//                 }
//             ],
//         });

//         // Sort orders based on createdAt attribute
//         ordersHistory.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//         // Group orders by day
//         const groupedOrders = ordersHistory.reduce((acc, order) => {
//             const orderDate = new Date(order.createdAt).toLocaleDateString();
//             const index = acc.findIndex(group => group[0] && new Date(group[0].createdAt).toLocaleDateString() === orderDate);

//             if (index !== -1) {
//                 acc[index].push(order);
//             } else {
//                 acc.push([order]);
//             }
//             return acc;
//         }, []);
//         res.status(200).json(groupedOrders);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json('error in git order history');
//     }
// };

// async function deleteOrder(req, res){
//     try{
//         const { orderID } = req.body;
//         const deleteOrder = await Order.findByPk(orderID);
//         // if(){

//         // }
//         await deleteOrder.update({is_deleted : true, is_delivered : true});
//         res.status(201).json(deleteOrder);
//     }catch(error){
//         console.log(error);
//         res.status(500).json('error in delete order controller');
//     }
// };