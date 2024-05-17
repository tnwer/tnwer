const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    comment_on: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    comment_At: {
        type: Date,
        default: Date.now,
        required: true
    },
    comment_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
