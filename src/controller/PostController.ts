import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { ZodError } from "zod";
import { BaseError } from "../error/BaseError";
import {
    inputFindPostByIdSchema,
    inputGetAllPostsSchema,
    inputLikesSchema,
    inputPostSchema
} from "../models/Post";

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) {}

    public createPost = async (req: Request, res: Response) => {
        try {
            const { authorization, content } = inputPostSchema.parse({
                authorization: req.headers.authorization,
                content: req.body.content
            })

            const result = await this.postBusiness.createNewPost(
                authorization,
                content
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

    public getAllPosts = async (req: Request, res: Response) => {
        try {
            const { authorization } = inputGetAllPostsSchema.parse({
                authorization: req.headers.authorization
            })

            const result = await this.postBusiness.getAllPosts(authorization)

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

    public findPostById = async (req: Request, res: Response) => {
        try {
            const { authorization, id } = inputFindPostByIdSchema.parse({
                authorization: req.headers.authorization,
                id: req.params.id
            })

            const result = await this.postBusiness.findPostById(authorization, id)

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

    public addLikes = async (req: Request, res: Response) => {
        try {
            const { authorization, id, likes } = inputLikesSchema.parse({
                authorization: req.headers.authorization,
                id: req.params.id,
                likes: req.body.likes
            })

            const result = await this.postBusiness.addLikes(
                authorization,
                id,
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
}