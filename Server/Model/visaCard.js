const mongoose = require('mongoose');
const { Schema } = mongoose;

const visaCardSchema = new Schema({
    card_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    card_number: {
        type: String,
        required: true,
        unique: true
    },
    card_holder_name: {
        type: String,
        required: true
    },
    expiration_date: {
        type: Date,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

const VisaCard = mongoose.model('VisaCard', visaCardSchema);

module.exports = VisaCard;
