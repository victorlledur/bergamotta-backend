import { NextFunction, Request, Response } from 'express'
import { prisma } from '../database/index'
import bcrypt from 'bcrypt'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'
import crypto from 'crypto'
import { mailerConfig } from '../modules/mailer'

const recoverPassword = {

  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body
    try {
      const ownerEmail = await prisma.owner.findUnique({
        where: {
          email: email,
        },
      })

      if (!ownerEmail) 
        return res.status(400).send({ error: 'owner not found' })

      const newHashPass = crypto.randomBytes(20).toString('hex').substring(0,10)
      const passwordReset = crypto
        .createHash('sha256')
        .update(newHashPass)
        .digest('hex')
      const passwordExpired = Date.now() + 1000 * 60 * 20 // password expira em 20 minutos
      
      await prisma.owner.update({
        where: {
          email,
        },
        data: {
          passwordReset,
          passwordExpired
        },
      })
      
      const token = decodeAndGenerateToken.generateToken({
        id: ownerEmail.id,
        name: ownerEmail.name,
        email: ownerEmail.email,
        password: newHashPass,
        passwordReset,
        passwordExpired,
      })

      mailerConfig.mailer(token)

      return res.status(200).json({
        ownerEmail,
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
      const ownerId = await prisma.owner.findUnique({
        where: {
          id,
        },
      })

      if (!ownerId) 
        return res.status(400).send({ error: 'owner not found' })
        
      if (req.method === 'PUT') {
        const hash = await bcrypt.hash(password, 10)

        await prisma.owner.update({
          where: {
            id,
          },
          
          data: {
            password: hash,
            passwordReset: null,
            passwordExpired: null
          },
        })
        return res.sendStatus(200)
      }
      return res.status(200).json({ status: true })
    } catch (error) {
      return res.status(400).send({ error: 'a error occurred: ' + error })
    }
  },
}

export default recoverPassword;
