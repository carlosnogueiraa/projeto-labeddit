import { BaseDB } from "./BaseDB";
import { user } from '../models/User'


export class UserDB extends BaseDB {
    private static TABLE_USERS = 'users'

    public findUserByEmail = async (email: string): Promise<user | undefined> => {
        return (
            await UserDB.connection(UserDB.TABLE_USERS)
                .where({ email })
        )[0]
    }

    public findUserById = async (id: string): Promise<user | undefined> => {
        return (
            await UserDB.connection(UserDB.TABLE_USERS)
                .where({ id })
        )[0]
    }

    public getUserDB = async (email: string): Promise<user | undefined> => {
        return (
            await UserDB.connection(UserDB.TABLE_USERS)
                .where({ email })
        )[0]
    }

    public compareUser = async (
        email: string,
        password: string
    ): Promise<user | undefined> => {
        return (
            await UserDB.connection(UserDB.TABLE_USERS)
                .where({ email,password })
        )[0]
    }

    public insertUser = async (data: user): Promise<void> => {
        await UserDB.connection(UserDB.TABLE_USERS)
            .insert(data)
    }
}