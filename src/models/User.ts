import { z } from "zod";
import { USER_ROLES } from "../services/Authenticator";

export class User {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private createdAt: string,
        private role: USER_ROLES,
        private terms: string
    ) {}

    public getId(): string{
        return this.id
    }

    public getName(): string{
        return this.name
    }

    public getEmail(): string{
        return this.email
    }

    public getPassword(): string{
        return this.password
    }

    public getCreatedAt(): string{
        return this.createdAt
    }

    public getRole(): USER_ROLES{
        return this.role
    }

    public getTerms(): string{
        return this.terms
    }
}

export interface user {
    id: string
    name: string
    email: string
    password: string
    createdAt: string
    role: USER_ROLES
    terms: string
}

export interface userController {
    name: string
	email: string
	password: string
	terms: string
}

export interface userLogin {
    email: string
    password: string
}

export const createUserSchema = z.object({
    name: z.string().min(4),
	email: z.string().email(),
	password: z.string().min(6),
	terms: z.string().nonempty()
}).transform((data) => data as userController)

export const userLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6)
}).transform((data) => data as userLogin)

export enum TERMS {
    accepted = 'accepted'
}