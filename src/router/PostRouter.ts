import { Router } from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { Authenticator } from "../services/Authenticator";
import { UserDB } from "../database/UserDB";
import { IdGenerator } from "../services/IdGenerator";
import { PostDB } from "../database/PostDB";

export const postRouter = Router()

const postController = new PostController(
    new PostBusiness(
        new Authenticator(),
        new UserDB(),
        new IdGenerator(),
        new PostDB()
    )
)

postRouter.get('/', postController.getAllPosts)
postRouter.get('/:id', postController.findPostById)

postRouter.post('/', postController.createPost)
postRouter.post('/:id', postController.addLikes)
