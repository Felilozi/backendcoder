import { getDAOS } from "../models/DAO/indexDAO.js"
const { usersDao } = getDAOS();


class UserService {
    static async createUser(data) {
        try {
            const result = await usersDao.createUsers(data)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getUser(email) {
        try {
            console.log(email)
            const result = await usersDao.getUsersByEmail(email)


            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getID(id) {
        try {
            console.log(email)
            const result = await usersDao.getUserById(id)
            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
}
export default UserService;