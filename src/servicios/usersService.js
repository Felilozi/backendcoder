import bcrypt from 'bcrypt'
import { getDAOS } from "../models/DAO/indexDAO.js"
const { usersDao } = getDAOS();


class userService {
    static async createUser(data) {
        try {
            data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10))
            const result = await usersDao.createUsers(data)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async getUsers() {
        try {
            const result = await usersDao.getUsers()

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getUser(email) {
        try {
            
            const result = await usersDao.getUsersByEmail(email)
            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getId(id) {
        try {

            const result = await usersDao.getUserById(id)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async updateUser(email, updatedUser) {
        try {

            const result = await usersDao.updateUsers(email,updatedUser)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async updateRole(email, newRole) {
        try {

            const result = await usersDao.updateRole(email, newRole)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteUser(email) {
        try {

            const result = await usersDao.deleteUser(email)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteUsers(time) {
        try {

            const result = await usersDao.deleteUsers(time)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
}
export default userService;
