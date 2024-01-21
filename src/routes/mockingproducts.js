'use strict'

import express from 'express'
import { generateMockProduct } from '../controller/pruebaProductoFaker'

const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/', async (req, res) => {
    const mockProducts = generateMockProduct(100);
    res.json(mockProducts)
    // res.send({ error: 'failed' })
})

export { router };