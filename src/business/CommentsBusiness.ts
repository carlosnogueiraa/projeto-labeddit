import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";
import { comments, Comments, likesDislikesComments } from "../models/Comments";
import { CommentsDB } from "../database/CommentsDB";
import { UserDB } from "../database/UserDB";
import { Post } from "../models/Post";
import { CreatePostOutputDTO } from "../DTOs/createPost.DTO";

export class CommentsBusiness {
    constructor(
        private authenticator: Authenticator,
        private userDB: UserDB,
        private idGenerator: IdGenerator,
        private commentsDB: CommentsDB
    ) {}

    public addComments = async (
        authorization: string,
        content: string,
        postId: string
    ) => {
        const payload = this.authenticator.getTokenPayload(authorization)

        if (payload === null) {
            throw new BadRequestError('Token Inválido')
        }

        const userDB = await this.userDB.findUserById(payload.id)

        if (!userDB) {
            throw new NotFoundError('Usuário não encontrado!')
        }

        const postDB = await this.commentsDB.getPostById(postId)

        if (!postDB) {
            throw new NotFoundError('Post não encontrado!')
        }

        const post = new Post(
            postDB.id,
            postDB.userId,
            postDB.userName,
            postDB.content,
            postDB.createdAt,
            postDB.likes,
            postDB.dislikes,
            postDB.comments
        )

        const id = this.idGenerator.generate()

        const newComment = new Comments(
            id,
            payload.id,
            postDB.id,
            userDB.name,
            content,
            new Date().toISOString(),
            0,
            0
        )

        post.addComments()

        await this.commentsDB.updatePost(post.postModel())
        await this.commentsDB.addComments(newComment.commentsModel())

        const output: CreatePostOutputDTO = {
            content: postDB.content
        }

        return output
    }

    public getCommentsByPostId = async (
        authorization: string,
        id: string
    ): Promise<comments[]> => {
        const payload = this.authenticator.getTokenPayload(authorization)

        if (payload === null) {
            throw new BadRequestError('Token Inválido')
        }

        return await this.commentsDB.getCommentsByPostId(id)
    }

    public addLikes = async (
        authorization: string,
        commentsId: string,
        postId: string,
        likes: number
    ): Promise<boolean> => {
        const payload = this.authenticator.getTokenPayload(authorization)

        if (payload === null) {
            throw new BadRequestError('Token Inválido')
        }

        const userDB = await this.commentsDB.getUserById(payload.id)

        if (!userDB) {
            throw new NotFoundError('Usuário não encontrado!')
        }

        const commentsDB = await this.commentsDB.getCommentsById(commentsId)

        if (!commentsDB) {
            throw new NotFoundError('Comentário não encontrado!')
        }

        const postDB = await this.commentsDB.getCommentsByPostId(postId)

        if (!postDB) {
            throw new NotFoundError('Post não encontrado!')
        }

        const newLike: likesDislikesComments = {
            userId: payload.id,
            commentsId,
            postId,
            likes
        }

        const comment = new Comments(
            commentsDB.id,
            commentsDB.userId,
            commentsDB.id,
            userDB.name,
            commentsDB.content,
            commentsDB.createdAt,
            commentsDB.likes,
            commentsDB.dislikes
        )

        const isLike = await this.commentsDB.getLikes(payload.id, commentsId)

        if (isLike) {
            if (isLike.likes === likes) {
                await this.commentsDB.deleteLike(payload.id, commentsId, likes)
                likes === 1 ? comment.removeLike() : comment.removeDislike()
            } else {
                await this.commentsDB.updateLike(newLike)

                if (likes === 1) {
                    comment.removeDislike()
                    comment.addLike()
                }

                if (likes === 0) {
                    comment.removeLike()
                    comment.addDislike()
                }
            }
        } else {
            await this.commentsDB.insertLike(newLike)
            likes === 1 ? comment.addLike() : comment.addDislike()
        }

        await this.commentsDB.updateComments(comment.commentsModel())

        if (likes === 1) {
            return true
        } else {
            return false
        }
    }
}
