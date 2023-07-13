import { describe } from "node:test";
import { UserBusiness } from "../../src/business/UserBusiness";
import { UserDB } from "../../src/database/UserDB";
import { IdGenerator } from "../../src/services/IdGenerator";
import { Authenticator } from "../../src/services/Authenticator";
import { Hashmanager } from "../../src/services/HashManager";
import { NotFoundError } from "../../src/error/NotFoundError";
import { BadRequestError } from "../../src/error/BadRequestError";

const userDatabaseMock = {} as UserDB
const idGeneratorMock = {} as IdGenerator
const authenticatorMock = {} as Authenticator
const hashManagerMock = {} as Hashmanager

const userBusinessMock = new UserBusiness(
    userDatabaseMock,
    idGeneratorMock,
    authenticatorMock,
    hashManagerMock
) as jest.Mocked<UserBusiness>


describe("Testes login", () => {
    test("Testando o login correto", async () => {
        const email = 'fulano@email.com'
        const password = 'hash-mock-fulano'

        userDatabaseMock.getUserDB = jest.fn().mockResolvedValue(true)
        hashManagerMock.compare = jest.fn().mockResolvedValue(true)
        authenticatorMock.generateToken = jest.fn().mockReturnValue('token')

        const result = await userBusinessMock.login(email, password)

        expect(result).toEqual({ token: 'token' })
    })

    test("Testando o login com email incorreto", async () => {
        const email = 'emailincorreto@email.com'
        const password = 'hash-mock-fulano'

        userDatabaseMock.getUserDB = jest.fn().mockResolvedValue(undefined)
        hashManagerMock.compare = jest.fn().mockResolvedValue(true)
        authenticatorMock.generateToken = jest.fn().mockReturnValue('token')

        await expect(async () => {
            await userBusinessMock.login(email, password)
        }).rejects.toThrow(new NotFoundError('Email não encontrado!'))
    })

    test("Testando o login com a senha incorreta", async () => {
        const email = 'fulano@email.com'
        const password = 'senha-incorreta'

        userDatabaseMock.getUserDB = jest.fn().mockResolvedValue(true)
        hashManagerMock.compare = jest.fn().mockResolvedValue(false)

        await expect(async () => {
            await userBusinessMock.login(email, password)
        }).rejects.toThrow(new BadRequestError('Senha incorreta!'))
    })
})