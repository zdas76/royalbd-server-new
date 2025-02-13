import { Application, NextFunction, Request, Response } from "express";
import cors from 'cors';
import router from "./App/routes";
import { StatusCodes } from "http-status-codes";
import express from 'express';


const app: Application = express();


app.use(cors())
// app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use('/api/v1', router);

// app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})


export default app;

