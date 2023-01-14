import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../database/index'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'

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
        .send({ message: 'email or password incorrect. Please, try again!' })
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
        return res.status(401).send({error: "the provide password has expired"})
      }
      if (findOwner.passwordReset !== password ){ 
        return res.status(401).send({error: "the provide password is incorrect"})
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
    return res.status(401).send({ error: 'email or passaword incorrect, please try again!' })
  },
}

export default authController
