import { PostDB } from "../database/PostDB";
import { UserDB } from "../database/UserDB";
import { Authenticator } from "../services/Authenticator";
import { BadRequestError } from "../error/BadRequestError"
import { NotFoundError } from "../error/NotFoundError";
import { IdGenerator } from "../services/IdGenerator";
import { Post, likesDislikes, postModel } from "../models/Post";
import { CreatePostOutputDTO } from "../DTOs/createPost.DTO";

export class PostBusiness {
    constructor(
        private authenticator: Authenticator,
        private userDB: UserDB,
        private idGenerator: IdGenerator,
        private postBaseDB: PostDB
    ) { }

    public createNewPost = async (
        authorization: string, content: string
    ) => {
        const payload = this.authenticator.getTokenPayload(authorization)

        if (payload === null) {
            throw new BadRequestError('Token Inválido!')
        }

        const isUser = await this.userDB.findUserById(payload.id)

        if (!isUser) {
            throw new NotFoundError('Usuário não encontrado!')
        }

        const id = this.idGenerator.generate()

        const newPost = new Post(
            id,
            payload.id,
            isUser.name,
            content,
            new Date().toISOString(),
            0,
            0,
            0
        )

        await this.postBaseDB.newPost(newPost.postModel())

        const output: CreatePostOutputDTO = {
            content: newPost.getContent()
        }

        return output
    }

    public getAllPosts = async (
        authorization: string
    ): Promise<postModel[]> => {
        const payload = this.authenticator.getTokenPayload(authorization)

        if (payload === null) {
            throw new BadRequestError('Token Inválido!')
        }

        const postData = await this.postBaseDB.getAllPosts()
        const result: postModel[] = postData.map((postData) => {
            return {
                id: postData.id,
                content: postData.content,
                createdAt: postData.createdAt,
                likes: postData.likes,
                dislikes: postData.dislikes,
                comments: postData.comments,
                owner: {
                    id: postData.userId,
                    name: postData.userName
                }
            }
        })

        return result
    }

    public findPostById = async (
        authorization: string,
        postId: string
    ) => {
        const payload = this.authenticator.getTokenPayload(authorization)

        if (payload === null) {
            throw new BadRequestError('Token Inválido!')
        }

        const postData = await this.postBaseDB.getPostById(postId)

        if (postData?.length === 0) {
            throw new NotFoundError('Post não encontrado!')
        }

        const result: postModel[] = postData?.map((postData) => {
            return {
                id: postData.id,
                content: postData.content,
                createdAt: postData.createdAt,
                likes: postData.likes,
                dislikes: postData.dislikes,
                comments: postData.comments,
                owner: {
                    id: postData.userId,
                    name: postData.userName
                }
            }
        })

        return result
    }

    public addLikes = async (
        authorization: string,
        postId: string,
        likes: number
    ): Promise<boolean> => {
        const payload = this.authenticator.getTokenPayload(authorization)

        if (payload === null) {
            throw new BadRequestError('Token Inválido!')
        }

        const userDB = await this.postBaseDB.getUserById(payload.id)

        if (!userDB) {
            throw new NotFoundError('Usuário não encontrado!')
        }

        const [postDB] = await this.postBaseDB.getPostById(postId)

        if (!postDB) {
            throw new NotFoundError('Post não encontrado!')
        }

        const newLike: likesDislikes = {
            userId: payload.id,
            postId,
            likes
        }

        const post = new Post(
            postDB.id,
            postDB.userId,
            userDB.name,
            postDB.content,
            postDB.createdAt,
            postDB.likes,
            postDB.dislikes,
            postDB.comments
        )

        const isLike = await this.postBaseDB.getLikes(payload.id, postId)

        if (isLike) {
            if (isLike.likes === likes) {
                await this.postBaseDB.deleteLike(payload.id, postId, likes)
                likes === 1 ? post.removeLike() : post.removeDislike()
            } else {
                await this.postBaseDB.updateLike(newLike)

                if (likes === 1) {
                    post.removeDislike()
                    post.addLike()
                }

                if (likes === 0) {
                    post.removeLike()
                    post.addDislike()
                }
            }
        } else {
            await this.postBaseDB.insertLike(newLike)
            likes === 1 ? post.addLike() : post.addDislike()
        }

        await this.postBaseDB.updatePost(post.postModel())

        if (likes === 1) {
            return true
        } else {
            return false
        }
    }
}