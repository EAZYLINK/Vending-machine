const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    amountAvailable: {
        type: Number,
        required: true,
    },

    cost: {
        type: Number,
        required: true,
        default: 0,
    },

    productName: {
        type: String,
        required: true,
    },

    seller: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
}, {timeStamps: true})

const productModel = model("products", productSchema) 

module.exports = productModel;