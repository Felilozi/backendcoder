import { Cart } from "../models/Models/cartModel.js";
import { SUCCESS, ERROR } from '../commons/dictionaryError.js'
import { getDAOS } from "../models/DAO/indexDAO.js"
const { cartDao } = getDAOS();


class cartService {
    static async getCarts() {
        try {
            const results = await cartDao.getCarts();
            return results

        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async createCart(email) {
        try {
            const cart = new Cart({
                purchaser: email,
                products: [],
            })

            const result = await cartDao.createCarts(cart)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getCartId(id) {
        try {

            const result = await cartDao.getCartsById(id);

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async getCartByEmail(email) {
        try {

            const result = await cartDao.getCartsByEmail(email);

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteCart(id) {
        try {

            const result = await cartDao.deleteCart(id);
            if (!result) {
                throw new Error(ERROR.CART_NOT_FOUND);
            }
            return result

        } catch (error) {
            throw new Error(ERROR.CART_DELETE_ERROR)
        }
    }

    static async deleteProduct(cartId, productId) {
        try {

            
            const result = await cartDao.deleteProduct(cartId, productId)
            if (!result) {
                throw new Error(ERROR.PRODUCT_DELETE_ERROR);
            }
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async addProduct(pid, quantity,cid) {
        try {

    
            const cart = await Cart.findOneAndUpdate(
                { _id: cid, 'products.producto': pid },
                { $inc: { 'products.$.quantity': quantity || 1 } },
                { new: true } // Return the modified document
            ).populate('products.producto');

            if (!cart) {
                const newCart = {
                    producto: pid,
                    quantity: quantity || 1
                };
                const result = await Cart.findOneAndUpdate({
                    _id: cid
                },
                    { $push: { products: newCart } },
                    { new: true } // Return the modified document
                ).populate('products.producto');
                if (!result) {
                    throw new Error(ERROR.PRODUCT_ADD_ERROR);
                }
                return result
            } else {
                return cart
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async updateProduct(products, cartId) {
        try {

            if (!Array.isArray(products)) {
                throw new Error(ERROR.PRODUCT_UPDATE_ERROR);
            }
            const existingCart = await Cart.findById(cartId);

            if (!existingCart) {
                throw new Error(ERROR.CART_NOT_FOUND);
            }

            existingCart.products = products;
            const result = await existingCart.save();
            if (!result) {
                throw new Error(ERROR.PRODUCT_UPDATE_ERROR);
            }
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default cartService;
