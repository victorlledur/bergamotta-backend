import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt  from "bcrypt";
import { prisma } from "../database/index"
const secret = process.env.SECRET_KEY as string;

const authController = {

    generateToken: function(params = {}){
        return jwt.sign(params, secret, {
            expiresIn: "2h"
        });
    },

    async authUser(req: Request, res: Response, next: NextFunction){
        const { email, password } = req.body
        const findUser =  await prisma.owner.findUnique({
            where: {
                email
            }
        })
         
        if( !findUser ){
            return res.status(403).send({ message: 'User or password incorrect. Please, try again!' })
        }

        if( !await bcrypt.compare(password, findUser.password )){
            return res.status(403).send({ message: 'User or password incorrect. Please, try again!' })
        }

        return res.status(200).send({
            findUser,
            token: authController.generateToken({ 
                id: findUser.id, 
                name: findUser.name, 
                email: findUser.email,
            })
        })
        
    },
}

export default authController;