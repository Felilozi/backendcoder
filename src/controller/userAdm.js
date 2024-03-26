'use strict'

import userService from '../servicios/usersService.js';
import cartService from '../servicios/cartServicios.js';

export const getUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userService.getUser(email);
        res.render('userAdmin', { user });
    } catch (error) {
        console.error('Error occurred while fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const updateUserRole = async (req, res) => {
    const { email, role } = req.body;
    const roleUpperCase = role.toUpperCase();
    try {
        const result = await userService.updateRole(email, roleUpperCase);

        if (result) {
            const user = await userService.getUser(email);
            res.render('userAdmin', { user });
        }
    } catch (error) {
        console.error('Error occurred while updating user role:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const deleteUser = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await userService.deleteUser(email);
        if (result) {
            res.redirect('/api/views/userAdmin');
        }

    } catch (error) {
        console.error('Error occurred while deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const displayCart = async (req, res) => {

    const cartCreated = await cartService.getCartByEmail(req.session.user.email)
    const cart = cartCreated._id
    const productData = cartCreated.products.map(product => ({
        title: product.producto.title,
        description: product.producto.description,
        quantity: product.quantity,
        price: product.producto.price * product.quantity,

    }));

    res.render('cartDetails', {
        products: productData,
        cart
    })
}



