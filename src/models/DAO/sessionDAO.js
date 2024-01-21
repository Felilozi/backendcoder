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

    async updateUsers(id, payload) {
        const updatedUser = await Users.updateOne({ _id: id }, {
            $set: payload
        });
        return updatedUser;
    }

    async getUserById(id) {
        const user = await Users.findOne({ _id: id }).lean();
        return user;
    }
}