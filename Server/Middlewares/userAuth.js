const jwt = require('jsonwebtoken');
require('dotenv').config();

async function authorize(req, res, next){
    try{
        console.log(req.headers.cookie);
        // const tokenCookie = req.headers.authorization;
        const tokenCookie = req.headers.cookie;
        const tokenValue = tokenCookie.split('=')[1];
        if (tokenCookie){
            const user = jwt.verify(tokenValue, process.env.SECRET_KEY);
            if(user.id){
                req.user = user;
                next();
            }else{
                res.status(401).json("unauthorized");
            }
        }else{
            res.status(401).json("you need to login first");
        }
    }catch(error){
        res.status(400).json("error in user auth");
    }
};

module.exports = {
    authorize,
};

// const express = require('express');
// const app = express();
// const jwt = require('jsonwebtoken');
// const Cookies = require('js-cookie');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();
// app.use(cookieParser());

// async function authorize(req, res, next){
//     try{
//         if (!req.user.user_id){
//             const tokenCookie = req.headers.cookie;
//             // const token = req.headers['authorization'];
//             console.log(token);
//             if (!token){
//                 res.status(401).json("you need to login first");
//             }else {
//                 const user = jwt.verify(token, process.env.SECRET_KEY);
//                 if (!user.user_id){
//                     res.status(401).json("unauthorized");
//                 }
//                 req.user = user;
//                 next();
//             }
//         }else {
//             next();
//         }
//     }catch(error){
//         res.status(400).json(error);
//     }
// };

// module.exports = {
//     authorize
// };