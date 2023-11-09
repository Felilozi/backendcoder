import express from 'express'
import { getCarts, createCart, getCartbyId, deleteCart, addProductToCart } from '../controller/cartController.js'
const router = express.Router()

// Import the ProductManager class
// import { CartManager } from '../controller/CartManager.js'; // Adjust the import path as needed

// // Create an instance of the ProductManager class, specifying the path to the data file
// const cartManager = new CartManager('cart.json'); // Specify the correct file path

// Middleware to parse JSON request bodies
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// Create Cart
router.post('/', createCart)

router.get('/', getCarts)
// Get a Cart by ID
router.get('/:cid', getCartbyId)

router.delete('/:cid', deleteCart)

// Create a new product or add products to Cart
router.post('/:cid/product/:pid', addProductToCart)

export { router }
