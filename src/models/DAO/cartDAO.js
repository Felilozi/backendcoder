import { Cart } from '../Models/cartModel.js';

export class CartDAO {
    async getCarts() {
        const Cart = await Cart.find().select(['-__v']).populate('products.producto').lean();
        return Cart;
    }

    async getCartsById(id) {
        const Cart = await Cart.findOne({ _id: id }).populate('products.producto').lean();
        return Cart;
    }

    async deleteCart(id) {
        const Cart = await Cart.deleteOne({ _id: id }).populate('products.producto');
        return Cart;
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