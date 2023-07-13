import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export enum USER_ROLES {
    NORMAL = 'NORMAL',
    ADMIN = 'ADMIN'
}

export interface TokenPayload {
    id: string,
    role: USER_ROLES
}

export class Authenticator {
    public generateToken = (payload: TokenPayload): string => {
        const token = jwt.sign(payload, process.env.JWT_KEY as string, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        })

        return token
    }

    public getTokenPayload = (token: string): TokenPayload | null => {
        try {
            const payload = jwt.verify(
                token, 
                process.env.JWT_KEY as string
            )

            return payload as TokenPayload
        } catch (error) {
            return null
        }
    }
}