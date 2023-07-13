import { BaseDB } from "./BaseDB";
import { likesDislikes, posts } from '../models/Post'
import { user } from "../models/User";


export class PostDB extends BaseDB {
    private static TABLE_USERS = 'users'
    private static TABLE_POSTS = 'posts'
    private static TABLE_LIKES = 'likes_dislikes'

    public newPost = async (data: posts): Promise<void> => {
        return await BaseDB.connection(PostDB.TABLE_POSTS).insert(data)
    }

    public updatePost = async (data: posts): Promise<void> => {
        return await BaseDB.connection(PostDB.TABLE_POSTS)
            .where({ id: data.id })
            .update({
                content: data.content,
                likes: data.likes,
                dislikes: data.dislikes
            })
    }

    public getPostById = async (id: string): Promise<posts[]> => {
        return await BaseDB.connection(PostDB.TABLE_POSTS)
            .where({ id })
    }

    public getUserById = async (id: string): Promise<user | undefined> => {
        return (
            await BaseDB.connection(PostDB.TABLE_USERS)
                .where({ id })
        )[0]
    }

    public getAllPosts = async (): Promise<posts[]> => {
        return await BaseDB.connection(PostDB.TABLE_POSTS)
    }

    public insertLike = async (data: likesDislikes): Promise<void> => {
        return await BaseDB.connection(PostDB.TABLE_LIKES)
            .insert(data)
    }

    public updateLike = async (data: likesDislikes): Promise<void> => {
        return await BaseDB.connection(PostDB.TABLE_LIKES)
            .where({
                userId: data.userId,
                postId: data.postId
            })
            .update(data)
    }

    public deleteLike = async (
        userId: string,
        postId: string,
        likes: number
    ): Promise<void> => {
        await BaseDB.connection(PostDB.TABLE_LIKES)
            .where({
                userId,
                postId,
                likes
            })
            .del()
    }

    public getLikes = async (
        userId: string,
        postId: string
    ): Promise<likesDislikes | undefined> => {
        return (
            await BaseDB.connection(PostDB.TABLE_LIKES)
                .where({
                    userId,
                    postId
                })
        )[0]
    }
} 