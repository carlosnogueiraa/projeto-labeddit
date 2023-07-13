import { Request, Response } from "express";
import { CommentsBusiness } from "../business/CommentsBusiness";
import { ZodError } from "zod";
import { BaseError } from "../error/BaseError";
import { inputGetCommentsSchema, inputNewCommentSchema, inputNewLikeSchema } from "../models/Comments";

export class CommentsController {
    constructor(
        private commentsBusiness: CommentsBusiness
    ) {}

    public createNewComment = async (req: Request, res: Response) => {
        try {
            const {
                authorization,
                content,
                id
            } = inputNewCommentSchema.parse({
                authorization: req.headers.authorization,
                content: req.body.content,
                id: req.params.id
            })
            const result = await this.commentsBusiness.addComments(
                authorization,
                content,
                id
            )

            res.status(201).send(result)
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400)
                    .json({
                        error: 'Erro de validação', issues: error.issues
                    })
            } else if (error instanceof BaseError) {
                res.status(error.statusCode)
                    .json({ error: error.message })
            } else {
                res.status(500)
                    .json({ error: 'Erro inesperado', message: error })
            }
        }
    }

    public createNewLike = async (req: Request, res: Response) => {
        try {
            const {
                authorization,
                id,
                likes,
                postId
            } = inputNewLikeSchema.parse({
                authorization: req.headers.authorization,
                id: req.params.id,
                postId: req.body.postId,
                likes: req.body.likes
            })
            const result = await this.commentsBusiness.addLikes(
                authorization,
                id,
                postId,
                likes
            )

            res.status(201).send(result)
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400)
                    .json({
                        error: 'Erro de validação', issues: error.issues
                    })
            } else if (error instanceof BaseError) {
                res.status(error.statusCode)
                    .json({ error: error.message })
            } else {
                res.status(500)
                    .json({ error: 'Erro inesperado', message: error })
            }
        }
    }

    public getCommentsByPostId = async (req: Request, res: Response) => {
        try {
            const {
                authorization,
                id
            } = inputGetCommentsSchema.parse({
                authorization: req.headers.authorization,
                id: req.params.id
            })
            const result = await this.commentsBusiness.getCommentsByPostId(
                authorization,
                id
            )

            res.status(201).send(result)
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400)
                    .json({
                        error: 'Erro de validação', issues: error.issues
                    })
            } else if (error instanceof BaseError) {
                res.status(error.statusCode)
                    .json({ error: error.message })
            } else {
                res.status(500)
                    .json({ error: 'Erro inesperado', message: error })
            }
        }
    }
}