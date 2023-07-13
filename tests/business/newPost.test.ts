import { PostBusiness } from "../../src/business/PostBusiness"
import { PostDB } from "../../src/database/PostDB"
import { UserDB } from "../../src/database/UserDB"
import { Authenticator } from "../../src/services/Authenticator"
import { IdGenerator } from "../../src/services/IdGenerator"

const userDataBaseMock = {} as UserDB
const postDatabaseMock = {} as PostDB
const idGeneratorMock = {} as IdGenerator
const authenticatorMock = {} as Authenticator

const postBusinessMock = new PostBusiness(
    authenticatorMock,
    userDataBaseMock,
    idGeneratorMock,
    postDatabaseMock
) as jest.Mocked<PostBusiness>


describe("Testes newPost", () => {
    test("Testando o newPost com dados válidos", async () => {
        const authorization = 'token-valido'
        const content = 'content'

        const payload = { id: 'userId' }

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(payload)
        userDataBaseMock.findUserById = jest.fn().mockResolvedValue(
            { name: 'fulano'}
        )
        postDatabaseMock.newPost = jest.fn().mockResolvedValue(true)
        idGeneratorMock.generate = jest.fn().mockReturnValue('mockedId')

        const output = { 
            content: 'content'
        }

        const result = await postBusinessMock.createNewPost(
            authorization,
            content
        )

        expect(result).toEqual(output)
    })

    test("Falha quando o usuário não for encontrado", async () => {
        const authorization = 'token-valido'
        const content = 'content'

        const payload = { id: 'userId' }

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(payload)
        userDataBaseMock.findUserById = jest.fn().mockResolvedValue(false)

        await expect(postBusinessMock.createNewPost(authorization, content))
            .rejects.toThrow('Usuário não encontrado!')
    })

    test("Falha quando o token for inválido", async () => {
        const authorization = 'token-invalido'
        const content = 'content'

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(null)

        await expect(postBusinessMock.createNewPost(authorization, content))
            .rejects.toThrow('Token Inválido!')
    })
})