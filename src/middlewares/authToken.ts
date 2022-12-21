import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
const secret = process.env.SECRET_KEY as string

export const validateToken = { 
    function (req: Request, res: Response, next: NextFunction) {
        const authHeaders = req.headers.authorization
        
        if(!authHeaders)
            return res.status(401).send({ error: 'No token provided!'});

        const parts = authHeaders.split(' ');

        if(!(parts.length === 2))
            return res.status(401).send({ error: 'Token invalid!'});

        const [ scheme, token ] = parts

        if(!/^Bearer$/.test(scheme))
            return res.status(401).send({ error: 'Is not a bearer token'});

        jwt.verify(token, secret, (err: any, decoded: any) => {
            if (err) 
                return res.status(401).send({ error: 'This token expired or was not valid'});
            
            if(!decoded.id)
                return res.status(401).send({ error: 'No id available'});
                
            if(decoded.id !== req.params.id){
                console.log("decoded.id ", decoded.id  )
                console.log("req.params.id", req.params.id)

                return res.status(200).send({ error: 'This token does not belong to this specific ID' })
            }
            
            console.log("Method: " + req.method);
            console.log(decoded);
          return next()
        })
    }
}
