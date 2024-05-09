const multer = require("multer");
const path = require("path");
const express = require('express');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const admin = require('firebase-admin');
const serviceAccount = require('../giftify-894d5-firebase-adminsdk-chas1-8f6df1e1c4.json');

const app = express();
app.use(express.static('public'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://giftify-894d5.appspot.com',
});

async function getImageDownloadUrl(imageName) {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(imageName);
  
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2025',
      });
      return url;
    } catch (error) {
      console.error('Error getting image download URL:', error);
      throw error;
    }
};

function uploadImg(req, res, next){
    try {
            upload.single('image')(req, res, async function (err) {
                if (err) {
                    console.error('Error uploading image:', err);
                    res.status(500).send('Error uploading image.');
                } else {
                    const bucket = admin.storage().bucket();
                    const imageBuffer = req.file.buffer;
                    const imageName = req.file.originalname;
                    const file = bucket.file(imageName);
                    const fileType = req.file.mimetype;
                    const result = await file.save(imageBuffer, { contentType: fileType });
                    const Name = imageName;
                    getImageDownloadUrl(Name)
                      .then(url => {
                        res.locals.site = url;
                        next();
                      })
                      .catch(error => {
                        console.error('Error:', error);
                      });
                }
            });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send('Error uploading image.');
    }
};

module.exports = { 
    uploadImg,
    admin
};