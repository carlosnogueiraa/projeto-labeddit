import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { ZodError } from "zod";
import { BaseError } from "../error/BaseError";
import { createUserSchema, userLoginSchema } from "../models/User";

export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ) {}

    public createAccount = async (req: Request, res: Response) => {
        try {
            const {
                name,
                email,
                password,
                terms
            } = createUserSchema.parse({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                terms: req.body.terms
            })

            const result = await this.userBusiness.createAccount(
                name,
                email,
                password,
                terms
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

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = userLoginSchema.parse({
                email: req.body.email,
                password: req.body.password
            })

            const result = await this.userBusiness.login(email, password)

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