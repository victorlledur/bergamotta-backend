import { Response, Request } from 'express';
import { NextFunction } from 'express-serve-static-core';

import { ValidationError } from "express-validation";
import { UnauthorizedError } from "express-jwt";


export default (error: any, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof ValidationError){
        return res.status(error.statusCode).json(error);
    }
    if(error instanceof UnauthorizedError){
        return res.status(error.status).json(error);
    }

    return res.status(500).json(error);
}