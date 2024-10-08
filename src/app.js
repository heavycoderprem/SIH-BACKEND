import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "100kb"}))
app.use(urlencoded({extended: true, limit: "100kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routes/user.routes.js"
import sheetRouter from "./routes/sheet.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/sheets", sheetRouter)
export {app}