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
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', getProducts);

router.get('/:pid', getProductByID)

router.post('/', roleAuth('current',true,'CREATE'),saveProduct)


router.put('/:pid',roleAuth('current',true,'UPDATE'), modifyProduct)

router.delete('/:pid',roleAuth('current',true,'DELETE'), deleteProduct)


export { router };
