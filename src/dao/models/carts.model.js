import mongoose from "mongoose";

const cartShema = new mongoose.model({
    userId: String,
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
        }
    ]
})

const Cart = mongoose.model('Cart', cartShema)

export default Cart