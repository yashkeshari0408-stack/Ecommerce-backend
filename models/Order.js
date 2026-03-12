const mongoose = require('mongoose');
const OSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                product: ObjectId.ref.Product,
                quantity: Number
                , price: Number
            }
        ],

        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed'],
            default: 'pending'
        },
        timestamps: true

    }
)

module.exports=mongoose.model("Order",OSchema);