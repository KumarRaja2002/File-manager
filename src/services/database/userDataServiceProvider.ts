import * as bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";
import { db } from '../../lib/db';
import { NewUser, User, users } from '../../schemas/user';
import { addSingleRecord, deleteSingleRecord, getRecordByColumn, updateSingleRecord } from '../../dbClient/dbClient';
import { NewDBRecord } from '../../utils/types';

export class UserDataServiceProvider {

    public async create(userData: NewUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        return await addSingleRecord<User>(users, userData);
    }

    public async findUserByEmail(email: string) {
        return await getRecordByColumn<User>(users, 'email', email);
    }

    public async findUserById(id: number) {
        return await getRecordByColumn<User>(users, 'id', id);
    }

    public async updateUserById(userData: NewDBRecord, id: number) {
        return await updateSingleRecord(users, userData, id);

    }

    public async deleteUserById(id: number) {
        return await deleteSingleRecord(users, id);
    }
}