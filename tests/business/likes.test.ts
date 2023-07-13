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

describe("Testes newLikes", () => {
    test("Adiciona um like", async () => {
        const authorization = 'token-valido'
        const postId = 'postId'
        const like = 1

        const payload = { id: 'userId' }

        const mockPost = [
            {
                id: 'postId',
                userId: 'u001',
                name: 'userName',
                content: 'content',
                createdAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                comments: 0,
            }
        ]

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(payload)
        postDatabaseMock.getUserById = jest.fn().mockResolvedValue({ name: 'u001' })
        postDatabaseMock.getPostById = jest.fn().mockResolvedValue([
            { ...mockPost[0] }
        ])
        postDatabaseMock.getLikes = jest.fn().mockResolvedValue(null)
        postDatabaseMock.insertLike = jest.fn().mockResolvedValue(true)
        postDatabaseMock.updatePost = jest.fn().mockResolvedValue(true)

        const result = await postBusinessMock.addLikes(
            authorization,
            postId,
            like
        )

        expect(result).toBe(true)
    })

    test("Adiciona um dislike", async () => {
        const authorization = 'token-valido'
        const postId = 'postId'
        const like = 0

        const payload = { id: 'userId' }

        const mockPost = [
            {
                id: 'postId',
                userId: 'u001',
                name: 'userName',
                content: 'content',
                createdAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                comments: 0,
            }
        ]

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(payload)
        postDatabaseMock.getUserById = jest.fn().mockResolvedValue({ name: 'u001' })
        postDatabaseMock.getPostById = jest.fn().mockResolvedValue([
            { ...mockPost[0] }
        ])
        postDatabaseMock.getLikes = jest.fn().mockResolvedValue(null)
        postDatabaseMock.insertLike = jest.fn().mockResolvedValue(true)
        postDatabaseMock.updatePost = jest.fn().mockResolvedValue(true)

        const result = await postBusinessMock.addLikes(
            authorization,
            postId,
            like
        )

        expect(result).toBe(false)
    })

    test("Falha quando o post não for encontrado", async () => {
        const authorization = 'token-valido'
        const postId = 'postId-invalido'
        const like = 1

        const payload = { id: 'userId' }

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(payload)
        postDatabaseMock.getUserById = jest.fn().mockResolvedValue({ name: 'u001' })
        postDatabaseMock.getPostById = jest.fn().mockResolvedValue([])

        await expect(postBusinessMock.addLikes(authorization, postId, like))
            .rejects.toThrow('Post não encontrado!')
    })

    test("Falha quando o token for inválido", async () => {
        const authorization = 'token-invalido'
        const postId = 'postId'
        const like = 1

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(null)

        await expect(postBusinessMock.addLikes(authorization, postId, like))
            .rejects.toThrow('Token Inválido!')
    })
})