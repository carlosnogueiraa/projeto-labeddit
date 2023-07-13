import { z } from "zod"

export class Comments {
    constructor(
        private id: string,
        private userId: string,
        private postId: string,
        private userName: string,
        private content: string,
        private createdAt: string,
        private likes: number,
        private dislikes: number
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

    public commentsModel(): comments {
        return {
            id: this.id,
			userId: this.userId,
            postId: this.postId,
			userName: this.userName,
			content: this.content,
			createdAt: this.createdAt,
			likes: this.likes,
			dislikes: this.dislikes
        }
    }
}

export interface comments {
    id: string,
    userId: string,
    postId: string,
    userName: string,
    content: string,
    createdAt: string,
    likes: number,
    dislikes: number
}

export interface inputFindCommentsById {
    authorization: string
    content: string
    id: string
}

export interface inputLikeInComment {
    authorization: string
	id: string
	postId: string
	likes: number
}

export interface inputGetComments {
    authorization: string
    id: string
}

export interface likesDislikesComments {
    userId: string
    commentsId: string
    postId: string
    likes: number
}

export const inputNewCommentSchema = z.object({
    authorization: z.string(),
    content: z.string(),
    id: z.string()
}).transform((data) => data as inputFindCommentsById)

export const inputNewLikeSchema = z.object({
    authorization: z.string(),
    id: z.string(),
    postId: z.string(),
    likes: z.number()
}).transform((data) => data as inputLikeInComment)

export const inputGetCommentsSchema = z.object({
    authorization: z.string(),
    id: z.string()
}).transform((data) => data as inputGetComments)