import { UserBusiness } from "../../src/business/UserBusiness"
import { UserDB } from "../../src/database/UserDB"
import { BadRequestError } from "../../src/error/BadRequestError"
import { NotFoundError } from "../../src/error/NotFoundError"
import { Authenticator } from "../../src/services/Authenticator"
import { Hashmanager } from "../../src/services/HashManager"
import { IdGenerator } from "../../src/services/IdGenerator"

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


describe("Testes signup", () => {
    test("Testando o signup criando um usuário corretamente", async () => {
        const name = 'fulano'
        const email = 'fulano@email.com'
        const password = 'hash-mock-fulano'
        const terms = 'accepted'

        userDatabaseMock.findUserByEmail = jest.fn().mockResolvedValue(undefined)
        idGeneratorMock.generate = jest.fn().mockReturnValue('mockedId')
        hashManagerMock.hash = jest.fn().mockResolvedValue('hash')
        authenticatorMock.generateToken = jest.fn().mockReturnValue('token')

        userDatabaseMock.insertUser = jest.fn().mockResolvedValue({
            name,
            email,
            password,
            terms
        })

        const result = await userBusinessMock.createAccount(
            name,
            email,
            password,
            terms
        )

        expect(authenticatorMock.generateToken).toHaveBeenCalled()
        expect(hashManagerMock.hash).toHaveBeenCalledWith(password)
        expect(result).toEqual({ token: 'token' })
    })

    test("Testando o signup com email já existente", async () => {
        const name = "fulano"
        const email = "fulano@email.com"
        const password = "hash-mock-fulano"
        const terms = "accepted"

        userDatabaseMock.findUserByEmail = jest.fn().mockResolvedValue(true)

        await expect(async () => {
            await userBusinessMock.createAccount(name, email, password, terms)
        }).rejects.toThrow(new NotFoundError("Já existe um usuário cadastrado com esse email!"))
    })

    test("Testando o signup sem aceitar os termos", async () => {
        const name = "fulano"
        const email = "fulano@email.com"
        const password = "hash-mock-fulano"
        const terms = "notAccepted"

        userDatabaseMock.findUserByEmail = jest.fn().mockResolvedValue(undefined)

        await expect(async () => {
            await userBusinessMock.createAccount(name, email, password, terms)
        }).rejects.toThrow(new BadRequestError("Você precisa aceitar os termos!"))
    })
})