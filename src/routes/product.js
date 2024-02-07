'use strict'

import express from 'express'

import {
    getProducts,
    saveProduct,
    getProductByID,
    deleteProduct,
    modifyProduct,
} from '../controller/productController.js'
import roleAuth from '../middleware/roleAuth.js'

const router = express.Router()
// Middleware to parse JSON request bodies
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// Get all products
router.get('/', getProducts)

// Get a product by ID
router.get('/:pid', getProductByID)

// Create a new product
// router.post('/', saveProduct)
router.post('/', roleAuth('current',true,'CREATE'),saveProduct)

// Update a product by ID
// router.put('/:pid', modifyProduct)
router.put('/:pid',roleAuth('current',true,'UPDATE'), modifyProduct)

// Delete a product by ID
// router.delete('/:pid', deleteProduct)
router.delete('/:pid',roleAuth('current',true,'DELETE'), deleteProduct)


export { router }
