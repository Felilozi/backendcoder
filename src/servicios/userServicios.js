import bcrypt from 'bcrypt'
// import { Users } from '../models/Moleds/usersmodel.js'
import { getDAOS } from "../models/daos/index.dao.js";
const { usersDao } = getDAOS();


class UserService {
    static async createUser(data) {
        try {
            // data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10))
            // const result = await Users.create(data)
            const result = await usersDao.createUser(data)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getUser(email) {
        try {
            console.log(email)
            const result = await usersDao.getUsersByEmail(email)
            // const result = await Users.findOne({ email }).lean()

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getID(id) {
        try {
            console.log(email)
            // const result = await Users.findById(id)
            const result = await usersDao.getUserById(id)
            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
}
export default UserService;