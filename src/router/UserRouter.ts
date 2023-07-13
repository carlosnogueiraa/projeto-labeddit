import { Router } from "express";
import { UserController } from "../controller/UserController";
import { UserBusiness } from "../business/UserBusiness";
import { UserDB } from "../database/UserDB";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { Hashmanager } from "../services/HashManager";

export const userRouter = Router()

const userController = new UserController(
    new UserBusiness(
        new UserDB(),
        new IdGenerator(),
        new Authenticator(),
        new Hashmanager()
    )
)

userRouter.post('/login', userController.login)
userRouter.post('/signup', userController.createAccount)
