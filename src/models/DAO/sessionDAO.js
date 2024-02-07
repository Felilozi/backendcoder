import { Users } from "../Models/usersModel.js";


export class UsersDAO {
    async getUsers() {
        const User = await Users.find().lean();
        return User;
    }

    async getUsersByEmail(id) {
        const User = await Users.findOne({ email: id }).lean();
        return User;
    }

    async createUsers(payload) {
        const newUser = await Users.create(payload);
        return newUser;
    }

    async updateUsers(email, payload) {
        const updatedUser = await Users.updateOne({ email: email }, {
            $set: payload
        });
        return updatedUser;
    }

    async getUserById(id) {
        const user = await Users.findOne({ _id: id }).lean();
        return user;
    }

    async updateRole(id, role) {

        const actualRole = await Users.findOne({ email: id, role: 'USER' }).lean();
        if (actualRole) {
            throw new Error(ERROR.ADMIN_ACTION_REQUIRED);
        }
        const updatedUser = await Users.updateOne({ email: id }, {
            $set: { role: role }
        });
        return updatedUser;
    }

}