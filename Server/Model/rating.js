const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
    rating_on: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    rating_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
