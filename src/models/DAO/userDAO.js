import { Users } from '../Models/usersModel.js';

export class UsersDAO {
    async getUsers() {
        const users = await Users.find().select('email first_name role').lean();

        return users;
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


    async deleteUsers(time) {
        try {
            // Calculate the date that is 'time' milliseconds ago
            const cutoffDate = new Date(Date.now() - time);

            // Delete users whose last_connection is before the cutoff date
            const result = await Users.deleteMany({ last_connection: { $lt: cutoffDate } });

            console.log(`${result.deletedCount} users deleted.`);
            return result.deletedCount;
        } catch (error) {
            console.error('Error occurred while deleting inactive users:', error);
            throw error;
        }
    }

    async deleteUser(email) {
        try {
            await Users.deleteOne({ email });
            return result;
        } catch (error) {
            console.error('Error occurred while deleting inactive users:', error);
            throw error;
        }
    }

    async updateRole(id, role) {

        const updatedUser = await Users.updateOne({ email: id }, {
            $set: { role: role }
        });
        return updatedUser;
    }

}