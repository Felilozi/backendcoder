import { Cart } from "../models/cartModel.js";
class CartService {
    static async getCartsService() {
        try {
            const result = await Cart.
                find({})
                .select(['-__v'])
                .populate('products.producto');
            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async createCart() {
        try {
            const cart = new Cart({
                products: [],
            })
            const result = await cart.save()

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async getCartbyId(id) {
        try {
            const query = Cart.where({ _id: id })
            const result = await query
                .findOne()
                .populate('products.producto');
            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async deleteCart(id) {
        try {
            const result = await Cart
                .deleteOne({ _id: id })
                .populate('products.producto');
            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async deleteProductFromCart(cartId, productId) {
        try {
            const result = await Cart.findByIdAndUpdate(
                cartId,
                { $pull: { products: { producto: productId } } },
                { new: true }
            ).populate('products.producto');
            return result


        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async addProductToCart(cid, pid, quantity) {
        try {
            const result = await Cart.findOneAndUpdate(
                { _id: cid, 'products.producto': pid },
                { $inc: { 'products.$.quantity': quantity || 1 } },
                { new: true } // Return the modified document
            ).populate('products.producto');

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
    savedCart
    static async addProductToCartsavedCart(id,newCart) {
        try {
            const result = await Cart.findOneAndUpdate({
                _id: id
            },
                { $push: { products: newCart } },
                { new: true } // Return the modified document
            ).populate('products.producto');

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async updateProduct(id) {
        try {
        const cartId = id
        const result = await Cart.findById(cartId);

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

}
export default CartService;
