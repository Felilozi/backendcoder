import { Cart } from '../Models/cartModel.js';

export class CartDAO {
    async getCarts() {
        const  carts = await Cart.find().select(['-__v']).populate('products.producto').lean();
        return  carts;
    }

    async getCartsById(id) {
        const cartId = await Cart.findOne({ _id: id }).populate('products.producto').lean();
        return cartId;
    }
    async getCartsByEmail(email) {
        const cartEmail = await Cart.findOne({ purchaser: email }).populate('products.producto').lean();
        return cartEmail;
    }
    async deleteCart(id) {
        const deletecart = await Cart.deleteOne({ _id: id }).populate('products.producto');
        return deletecart;
    }

    async deleteProduct(cartId, productId) {
        const result = await Cart.findByIdAndUpdate(
            cartId,
            { $pull: { products: { producto: productId } } },
            { new: true }
        ).populate('products.producto');
        return result;
    }

    async createCarts(payload) {
        const newCart = await Cart.create(payload);
        return newCart;
    }

    async updateCarts(id, payload) {
        const updatedCart = await Cart.updateOne({ _id: id }, {
            $set: payload
        });
        return updatedCart;
    }
}