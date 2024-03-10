import { CartDAO } from "./cartDAO.js";
import { TicketDAO } from "./ticketDAO.js";
import { ProductDAO } from "./productDAO.js";
import { UsersDAO } from "./userDAO.js";

const usersDao = new UsersDAO();
const cartDao = new CartDAO();
const ticketsDao = new TicketDAO();
const productsDao = new ProductDAO();

export const getDAOS = () => {
    return {
        usersDao,
        cartDao,
        ticketsDao,
        productsDao,
    }
}