import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../database/index'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'
import { ERRORS } from '../constants/error'

const authController = {
  
  async authOwner(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body
    
    let findOwner: any

          findOwner = await prisma.owner.findUnique({
            where: { email },
          })
        
        
    if (!findOwner) {
      return res
        .status(403)
        .send({ message: ERRORS.CONTROLLERS.AUTH_USER_OWNER.EMAIL_OR_PASS_INCORRECT })
    }

    if (await bcrypt.compare(password, findOwner.password)) {
      return res.status(200).json({
        findOwner,
        token: decodeAndGenerateToken.generateToken({
          id: findOwner.id,
          name: findOwner.name,
          email: findOwner.email,
          password: findOwner.password,
        }),
      })
    }
    
    if (findOwner.passwordReset && findOwner.passwordExpired){
      if (findOwner.passwordExpired < Date.now()){
        return res.status(401).send({error: ERRORS.CONTROLLERS.AUTH_USER_OWNER.PASSWORD_EXPIRED})
      }
      if (findOwner.passwordReset !== password ){ 
        return res.status(401).send({error: ERRORS.CONTROLLERS.AUTH_USER_OWNER.PASSWORD_INCORRECT})
      }

        return res.status(200).json({
          findOwner,
          token: decodeAndGenerateToken.generateToken({
            id: findOwner.id,
            name: findOwner.name,
            email: findOwner.email,
            passwordReset: findOwner.passwordReset,
            passwordExpired: findOwner.passwordExpired
          }),
        })
    }
    return res.status(401).send({ error: ERRORS.CONTROLLERS.AUTH_USER_OWNER.EMAIL_OR_PASS_INCORRECT })
  },
}

export default authController
