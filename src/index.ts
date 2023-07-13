import express, { Request, Response } from "express";
import cors from "cors";
import { userRouter } from "./router/UserRouter";
import { postRouter } from "./router/PostRouter";
import { commentsRouter } from "./router/CommentsRouter";

const app = express()

app.use(express.json())
app.use(cors())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.get('/ping', (res: Response) => {
    res.send('Pong!')
})

app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/comments', commentsRouter)

