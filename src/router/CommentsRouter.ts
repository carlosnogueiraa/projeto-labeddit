import { Router } from "express";
import { CommentsController } from "../controller/CommentsController";
import { CommentsBusiness } from "../business/CommentsBusiness";
import { Authenticator } from "../services/Authenticator";
import { CommentsDB } from "../database/CommentsDB";
import { IdGenerator } from "../services/IdGenerator";
import { UserDB } from "../database/UserDB";

export const commentsRouter = Router()

const commentsController = new CommentsController(
    new CommentsBusiness(
        new Authenticator(),
        new UserDB(),
        new IdGenerator(),
        new CommentsDB()
    )
)

commentsRouter.get('/:id', commentsController.getCommentsByPostId)

commentsRouter.post('/:id', commentsController.createNewComment)
commentsRouter.post('/likes/:id', commentsController.createNewLike)