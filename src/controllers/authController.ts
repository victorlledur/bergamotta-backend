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

    if (!(await bcrypt.compare(password, findUser.password))) {
      return res
        .status(403)
        .send({ message: 'User or password incorrect. Please, try again!' })
    }

    return res.status(200).send({
      findUser,
      token: decodeAndGenerateToken.generateToken({
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
      }),
    })
  },
}

export default authController
