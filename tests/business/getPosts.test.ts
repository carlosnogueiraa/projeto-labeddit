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

describe("Testes getPosts", () => {
    test("Retorna todos os posts", async () => {
        const authorization = 'token-valido'
        const payload = { id: 'userId' }

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(payload)

        const mockPost = [
            {
                id: 'post001',
                content: 'content',
                createdAt: 'date',
                likes: 2,
                dislikes: 1,
                comments: 0,
                userId: 'u001',
                userName: 'userName'
            }
        ]

        postDatabaseMock.getAllPosts = jest.fn().mockResolvedValue(mockPost)

        const result = await postBusinessMock.getAllPosts(authorization)

        expect(result).toEqual(mockPost.map((post) => ({
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            likes: post.likes,
            dislikes: post.dislikes,
            comments: post.comments,
            owner: {
                id: post.userId,
                name: post.userName
            }
        }))
        )
    })

    test("Falha quando o token é inválido", async () => {
        const authorization = 'token-invalido'

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(null)

        await expect(postBusinessMock.getAllPosts(authorization))
            .rejects.toThrow('Token Inválido!')
    })
})