import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../database/index'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'
import jwt from 'jsonwebtoken'
const authController = {

  async authUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body

    const findUser = await prisma.owner.findUnique({
      where: {
        email,
      },
    })

    if (!findUser) {
      return res
        .status(403)
        .send({ message: 'User or password incorrect. Please, try again!' })
    }

    if (await bcrypt.compare(password, findUser.password)) {
      return res.status(200).json({
        findUser,
        token: decodeAndGenerateToken.generateToken({
          id: findUser.id,
          name: findUser.name,
          password: findUser.password,
        }),
      })
    }
    if (findUser.passwordReset && findUser.passwordExpired){
      if (findUser.passwordExpired < Date.now()){
        return res.status(401).send({error: "the password has expired"})
      }
      if (findUser.passwordReset !== password){
        return res.status(401).send({error: "the password is incorrect"})
      }

        return res.status(200).json({
          findUser,
          token: decodeAndGenerateToken.generateToken({
            id: findUser.id,
            name: findUser.name,
            passwordReset: findUser.passwordReset
          }),
        })
    }
    return res.status(401).send({ error: 'email or passaword incorrect, please try again!' })
  },
}

export default authController
