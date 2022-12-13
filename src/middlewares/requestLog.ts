import { NextFunction, Request, Response } from 'express';
export default (req: Request, res: Response, next: NextFunction)=>{
    console.log(`O ip: ${req.ip} acessou a rota: ${req.originalUrl}`);
    next()
}