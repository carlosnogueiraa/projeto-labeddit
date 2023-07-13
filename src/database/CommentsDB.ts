import { comments, likesDislikesComments } from "../models/Comments";
import { likesDislikes, posts } from "../models/Post";
import { user } from "../models/User";
import { BaseDB } from "./BaseDB";


export class CommentsDB extends BaseDB {
    private static TABLE_USERS = 'users'
    private static TABLE_POSTS = 'posts'
    private static TABLE_COMMENTS = 'comments'
    private static TABLE_LIKES_COMMENTS = 'likes_dislikes_comments'

    public addComments = async (data: comments): Promise<void> => {
        return await BaseDB.connection(CommentsDB.TABLE_COMMENTS).insert(data)
    }

    public updatePost = async (data: posts): Promise<void> => {
        return await BaseDB.connection(CommentsDB.TABLE_POSTS)
            .where({ id: data.id })
            .update({ comments: data.comments })
    }

    public updateComments = async (data: comments): Promise<void> => {
        await BaseDB.connection(CommentsDB.TABLE_COMMENTS)
            .where({ id: data.id })
            .update({
                content: data.content,
                likes: data.likes,
                dislikes: data.dislikes
            })
    }

    public getCommentsById = async (id: string): Promise<comments | undefined> => {
        return (
            await BaseDB.connection(CommentsDB.TABLE_COMMENTS)
                .where({ id })
        )[0]
    }

    public getPostById = async (id: string): Promise<posts | undefined> => {
        return (
            await BaseDB.connection(CommentsDB.TABLE_POSTS)
                .where({ id })
        )[0]
    }

    public getUserById = async (id: string): Promise<user | undefined> => {
        return (
            await BaseDB.connection(CommentsDB.TABLE_USERS)
                .where({ id })
        )[0]
    }

    public getCommentsByPostId = async (id: string): Promise<comments[]> => {
        return await BaseDB.connection(CommentsDB.TABLE_COMMENTS)
            .where({ postId: id })
    }

    public insertLike = async (data: likesDislikesComments): Promise<void> => {
        return await BaseDB.connection(CommentsDB.TABLE_LIKES_COMMENTS)
            .insert(data)
    }

    public updateLike = async (data: likesDislikesComments): Promise<void> => {
        return await BaseDB.connection(CommentsDB.TABLE_LIKES_COMMENTS)
        .where({
            userId: data.userId,
            postId: data.postId
        })
        .update(data)
    }

    public deleteLike = async (
        userId: string,
        commentsId: string,
        likes: number
    ): Promise<void> => {
        await BaseDB.connection(CommentsDB.TABLE_LIKES_COMMENTS)
            .where({
                userId,
                commentsId,
                likes
            })
            .del()
    }

    public getLikes = async (
        userId: string,
        commentsId: string
    ): Promise<likesDislikes | undefined> => {
        return (
            await BaseDB.connection(CommentsDB.TABLE_LIKES_COMMENTS)
                .where({
                    userId,
                    commentsId
                })
        )[0]
    }
}