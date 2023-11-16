'use strict'

// const fs = require('node:fs/promises')

import * as fs from 'node:fs/promises'

export class CartManager {
    constructor(path) {
        this.cart = []
        this.cartIdCounter = 0
        this.errors = {
            ERROR_READING_FILE: 'Error al leer el archivo',
            ERROR_READING_FILE_ID: 'No se encontró el carrito especificado',
            ERROR_WRITING_FILE: 'Error al escribir el archivo',
            ERROR_UPDATING_FILE: 'Error al actualizar el archivo',
            ERROR_DELETING_FILE: 'Error al eliminar el archivo',
        }
        this.path = path
    }

    // Metodo Async para Crear o Sobreescribir el archivo
    async WriteFile(productToWrite) {
        try {
            // Asynchronous code here
            if (productToWrite) {
                await fs.writeFile(this.path, JSON.stringify(productToWrite))
            } else {
                await fs.unlink(this.path)
            }
        } catch (error) {
            // Handle errors
            console.error('An error occurred:', this.errors.ERROR_WRITING_FILE)
            throw error // Optionally, you can re-throw the error for further handling
        }
    }

    async addCart() {
        // Agregamos el carrito con un id autoincrementable
        const Cart = {
            id: this.cartIdCounter++,
            products: [],
        }

        this.cart.push(Cart)
        this.WriteFile(this.cart)
        return this.cartIdCounter
    }

    async getCartById(Id) {
        try {
            const fileContent = await fs.readFile(this.path, 'utf-8')
            if (fileContent) {
                let CartById = JSON.parse(fileContent).find(cart => cart.id === Id)
                if (!CartById) {
                    throw new Error(this.errors.ERROR_READING_FILE_ID)
                } else {
                    return CartById.products
                }
            } else {
                throw new Error(this.errors.ERROR_READING_FILE)
            }
        } catch (error) {
            // Handle errors
            console.error('An error occurred:', this.errors.ERROR_READING_FILE)
            throw error // Optionally, you can re-throw the error for further handling
        }
    }
    async addProductToCart(id, productId) {
        try {
            const fileContent = await fs.readFile(this.path, 'utf-8')
            if (fileContent) {
                const CartsFromFile = JSON.parse(fileContent)
                const CartIndex = CartsFromFile.findIndex(cart => cart.id === id)

                if (CartIndex === -1) {
                    throw new Error(this.errors.ERROR_READING_FILE_ID)
                }
                // Get product if find
                let ProductByIdIndex = CartsFromFile[CartIndex].products.findIndex(
                    product => product.productId === productId
                )

                // Update the specified product quantity
                if (ProductByIdIndex !== -1) {
                    CartsFromFile[id].products[ProductByIdIndex].quantity += 1
                    this.cart[id].products[ProductByIdIndex].quantity += 1
                } else {
                    // If the product doesn´t exists, create it
                    const product = {
                        productId,
                        quantity: 1,
                    }
                    CartsFromFile[id].products.push(product)
                    this.cart.push(...CartsFromFile)
                }

                // // Update the local this.cart array
                // const localCartIndex = this.cart.findIndex(cart => cart.id === id);
                // if (localCartIndex !== -1) {
                //     if (fieldToUpdate) {

                //         this.cart[localCartIndex][fieldToUpdate] = newValue;
                //     } else {
                //         // If fieldToUpdate is not provided, update the whole product object
                //         this.cart[localProductIndex] = newValue;
                //     }
                // }

                // Write the updated data back to the file

                this.WriteFile(this.cart)
                return `Producto agregado correctamente al carrito ${id}`
            } else {
                throw new Error(this.errors.ERROR_READING_FILE)
            }
        } catch (error) {
            console.error('An error occurred:', this.errors.ERROR_UPDATING_FILE)
            throw error
        }
    }

    async deleteProduct(id) {
        try {
            // Read the file to get the current products
            const fileContent = await fs.readFile(this.path, 'utf-8')
            if (fileContent) {
                const productsFromFile = JSON.parse(fileContent)

                // Find the index of the product to delete
                const productIndex = productsFromFile.findIndex(product => product.id === id)

                if (productIndex === -1) {
                    throw new Error(this.errors.ERROR_READING_FILE_ID)
                }

                // Remove the product from the array
                productsFromFile.splice(productIndex, 1)

                // Update the file with the modified array
                await this.WriteFile(productsFromFile)

                // Update the local this.cart array
                const localProductIndex = this.cart.findIndex(product => product.id === id)
                if (localProductIndex !== -1) {
                    this.cart.splice(localProductIndex, 1)
                }

                return `Product with ID ${id} has been deleted.`
            } else {
                throw new Error(this.errors.ERROR_READING_FILE)
            }
        } catch (error) {
            console.error('An error occurred:', this.errors.ERROR_DELETING_FILE)
            throw error
        }
    }
}
