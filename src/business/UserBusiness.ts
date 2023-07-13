import { UserDB } from "../database/UserDB";
import { Authenticator, TokenPayload, USER_ROLES } from "../services/Authenticator";
import { Hashmanager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { NotFoundError } from "../error/NotFoundError";
import { BadRequestError } from "../error/BadRequestError";
import { TERMS, User, user } from "../models/User";
import { token } from "../DTOs/login.DTO";

export class UserBusiness {
    constructor(
        private userDB: UserDB,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private hashManager: Hashmanager
    ) { }

    public createAccount = async (
        name: string,
        email: string,
        password: string,
        terms: string
    ): Promise<token> => {
        const isEmail = await this.userDB.findUserByEmail(email)

        if (isEmail) {
            throw new BadRequestError('Já existe um usuário cadastrado com esse email!')
        }

        if (terms !== 'accepted') {
            throw new BadRequestError('Você precisa aceitar os termos!')
        }

        const id = this.idGenerator.generate()
        const hash = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            name,
            email,
            hash,
            new Date().toString(),
            USER_ROLES.NORMAL,
            TERMS.accepted
        )

        const userDB: user = {
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            createdAt: newUser.getCreatedAt(),
            role: newUser.getRole(),
            terms: newUser.getTerms()
        }

        await this.userDB.insertUser(userDB)

        const payload: TokenPayload = {
            id: userDB.id,
            role: userDB.role
        }

        const token = this.authenticator.generateToken(payload)

        return { token }
    }

    public login = async (
        email: string, password: string
    ): Promise<token> => {
        const userDB = await this.userDB.getUserDB(email)

        if (!userDB) {
            throw new NotFoundError('Email não encontrado!')
        }

        const hash = await this.hashManager.compare(password, userDB?.password)

        if (!hash) {
            throw new BadRequestError('Senha incorreta!')
        }

        const payload: TokenPayload = {
            id: userDB.id,
            role: userDB.role
        }

        const token = this.authenticator.generateToken(payload)

        return { token }
    }
}