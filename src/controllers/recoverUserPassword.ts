import { NextFunction, Request, Response } from 'express'
import { prisma } from '../database/index'
import bcrypt from 'bcrypt'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'
import crypto from 'crypto'
import { mailerConfig } from '../modules/mailer'

const recoverUserPassword = {

  async forgetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body
      
      const findUser = await prisma.user.findUnique({
        where: { email },
      })

      if(!findUser)
        return res.status(401).send({ error: 'Not found' }) 

      const newHashPass = crypto
        .randomBytes(20)
        .toString('hex')
        .substring(0, 10)
      const passwordReset = crypto
        .createHash('sha256')
        .update(newHashPass)
        .digest('hex')
      const passwordExpired = Date.now() + 1000 * 60 * 20 // password expira em 20 minutos

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          passwordReset,
          passwordExpired,
        },
      })

      const token = decodeAndGenerateToken.generateToken({
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        password: newHashPass,
        passwordReset,
        passwordExpired,
      })

      mailerConfig.mailer(token, "user")

      return res.status(200).json({
        findUser,
        token,
      })
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { password } = req.body
      const { id } = req.params
      
      const findUser = await prisma.user.count({
        where: { id },
      })

      if(!findUser)
        return res.status(401).send({ error: 'Not found' }) 
        
        try {
          if (req.method === 'PUT') {
            const hash = await bcrypt.hash(password, 10)

            await prisma.user.update({
              where: {
                id,
              },

              data: {
                password: hash,
                passwordReset: null,
                passwordExpired: null,
              },
            })
            return res.sendStatus(200)
          }
        } catch (error) {
          return res.status(400).send({ error: 'a error occurred: ' + error })
        }
      
      return res.status(200).json({ status: true })
    } catch (error) {
      return res.status(400).send({ error: 'a error occurred: ' + error })
    }
  },
}

export default recoverUserPassword
