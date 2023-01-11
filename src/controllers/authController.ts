import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../database/index'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'
import userOrOwner from '../helpers/userOrOwner'

const authController = {
  
  async authUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body


    let findUser: any

        const status = await userOrOwner.byEmail( email )
        if (!status) {
          return res.status(401).send({ error: 'Not found' })
        }
        if (status === 'owner') {
          findUser = await prisma.owner.findUnique({
            where: { email },
          })
        }
        if (status === 'user') {
          findUser = await prisma.user.findUnique({
            where: { email },
          })
        }
        
    if (!findUser) {
      return res
        .status(403)
        .send({ message: 'user or password incorrect. Please, try again!' })
    }

    if (await bcrypt.compare(password, findUser.password)) {
      return res.status(200).json({
        findUser,
        token: decodeAndGenerateToken.generateToken({
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          password: findUser.password,
        }),
      })
    }
    
    if (findUser.passwordReset && findUser.passwordExpired){
      if (findUser.passwordExpired < Date.now()){
        return res.status(401).send({error: "the provide password has expired"})
      }
      if (findUser.passwordReset !== password ){ 
        return res.status(401).send({error: "the provide password is incorrect"})
      }

        return res.status(200).json({
          findUser,
          token: decodeAndGenerateToken.generateToken({
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            passwordReset: findUser.passwordReset,
            passwordExpired: findUser.passwordExpired
          }),
        })
    }
    return res.status(401).send({ error: 'email or passaword incorrect, please try again!' })
  },
}

export default authController
