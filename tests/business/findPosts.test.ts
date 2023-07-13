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

describe("Testes findPosts", () => {
    test("Retorna o post de acordo com o Id", async () => {
        const authorization = 'token-valido'
        const postId = 'postId'

        const payload = { id: 'userId' }

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(payload)

        const mockPost = [
            {
                id: postId,
                content: 'content',
                createdAt: 'date',
                likes: 2,
                dislikes: 1,
                comments: 0,
                userId: 'u001',
                userName: 'userName'
            }
        ]

        postDatabaseMock.getPostById = jest.fn().mockResolvedValue(mockPost)

        const result = await postBusinessMock.findPostById(
            authorization,
            postId
        )

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

    test("Falha quando o post não for encontrado", async () => {
        const authorization = 'token-valido'
        const postId = 'postId-invalido'

        const payload = { id: 'userId' }

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(payload)
        postDatabaseMock.getPostById = jest.fn().mockResolvedValue([])

        await expect(postBusinessMock.findPostById(authorization, postId))
            .rejects.toThrow('Post não encontrado!')
    })

    test("Falha quando o token for inválido", async () => {
        const authorization = 'token-invalido'
        const postId = 'postId'

        authenticatorMock.getTokenPayload = jest.fn().mockReturnValue(null)

        await expect(postBusinessMock.findPostById(authorization, postId))
            .rejects.toThrow('Token Inválido!')
    })
})