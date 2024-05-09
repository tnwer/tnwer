const mongoose = require('mongoose');
const { Schema } = mongoose;

const discountSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

discountSchema.pre('save', async function(next) {
    if (this.end_date < new Date()) {
        try {
            await this.model('Product').updateOne(
                { _id: this.product },
                { $set: { discount: null } }
            );
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;