import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './User.controller';
import { userValidaton } from './User.validation';
import upload from '../../../helpars/uploads';

const router = express.Router();


router.post('/create-employee', upload.single('photo'), (req:Request, res:Response, next:NextFunction)=> {
    req.body = userValidaton.createEmployee.parse(JSON.parse(req.body.data))
    return  UserControllers.createEmployee(req, res, next)
})

router.post('/creat-admin', upload.single('photo'), (req:Request, res:Response, next:NextFunction)=> {
    req.body = userValidaton.createAdmin.parse(JSON.parse(req.body.data))
    return  UserControllers.createAdmin(req, res, next)
})

router.get('/', UserControllers.getAllUser)

export const UserRouter=router;