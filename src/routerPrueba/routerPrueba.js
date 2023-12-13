import express from 'express'
import { getProducts } from '../controller/productController.js'
const routerPrueba = express.Router()
routerPrueba.get('/',getProducts)
export { routerPrueba }