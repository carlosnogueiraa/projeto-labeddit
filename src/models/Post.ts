import { z } from "zod"

export class Post {
    constructor(
        private id: string,
        private userId: string,
        private userName: string,
        private content: string,
        private createdAt: string,
        private likes: number,
        private dislikes: number,
        private comments: number
    ) {}

    public addLike(): void {
        this.likes = this.likes + 1
    }

    public addDislike(): void {
        this.dislikes = this.dislikes + 1
    }

    public removeLike(): void {
        this.likes = this.likes - 1
    }

    public removeDislike(): void {
        this.dislikes = this.dislikes - 1
    }

    public addComments(): void {
        this.comments = this.comments + 1
    }

    public removeComments(): void {
        this.comments = this.comments - 1
    }

    public getContent(): string{
        return this.content
    }

    public postModel(): posts {
        return {
            id: this.id,
			userId: this.userId,
			userName: this.userName,
			content: this.content,
			createdAt: this.createdAt,
			likes: this.likes,
			dislikes: this.dislikes,
			comments: this.comments
        }
    }
}

export interface posts {
    id: string
    userId: string
    userName: string
    content: string
    createdAt: string
    likes: number
    dislikes: number
    comments: number
}

export interface postModel {
    id: string
    content: string
    createdAt: string
    likes: number
    dislikes: number
    comments: number
    owner: {
        id: string
        name: string
    }
}

export interface inputPost {
    authorization: string
    content: string
}

export interface inputGetAllPosts {
    authorization: string
}

export interface inputFindPostById {
    authorization: string
    id: string
}

export interface likesDislikes {
    userId: string
    postId: string
    likes: number
}

export interface inputLikes {
    authorization: string
    id: string
    likes: number
}

export const inputPostSchema = z.object({
    authorization: z.string(),
    content: z.string()
}).transform((data) => data as inputPost)

export const inputGetAllPostsSchema = z.object({
    authorization: z.string()
}).transform((data) => data as inputGetAllPosts)

export const inputFindPostByIdSchema = z.object({
    authorization: z.string(),
    id: z.string()
}).transform((data) => data as inputFindPostById)

export const inputLikesDislikesSchema = z.object({
    userId: z.string(),
    postId: z.string(),
    likes: z.number()
}).transform((data) => data as likesDislikes)

export const inputLikesSchema = z.object({
    authorization: z.string(),
    id: z.string(),
    likes: z.number()
}).transform((data) => data as inputLikes)

