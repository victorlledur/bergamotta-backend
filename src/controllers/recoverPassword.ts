import { NextFunction, Request, Response } from 'express'
import { prisma } from '../database/index'
import bcrypt from 'bcrypt'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'
import crypto from 'crypto'
import { mailerConfig } from '../modules/mailer'
import userOrOwner from '../helpers/userOrOwner'

const recoverPassword = {

  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body
    try {
      let findUser: any

      const status = await userOrOwner.byEmail( email )

      if (!status) {
        return res.status(401).send({ error: 'Not found' })
      }

      if (status === 'owner') {
        findUser = await prisma.owner.findUnique({
          where: { email },
        })
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
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          password: newHashPass,
          passwordReset,
          passwordExpired,
        })
  
        mailerConfig.mailer(token)
  
        return res.status(200).json({
          findUser,
          token,
        })
      }
      
      if (status === 'user') {
        findUser = await prisma.user.findUnique({
          where: { email },
        })
        const newHashPass = crypto.randomBytes(20).toString('hex').substring(0,10)
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
          passwordExpired
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

      mailerConfig.mailer(token)

      return res.status(200).json({
        findUser,
        token,
      })
      }
      
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { password } = req.body

      const { id } = req.params
      let findUser: any

      const status = await userOrOwner.byId( id )

      if (!status) {
        return res.status(401).send({ error: 'Not found' })
      }

      if (status === 'owner') {
        findUser = await prisma.owner.findUnique({
          where: { id: req.params.id },
        })

        try {
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
        } catch (error) {
          return res.status(400).send({ error: 'a error occurred: ' + error })
        }
      }
      if (status === 'user') {
        findUser = await prisma.user.findUnique({
          where: { id: req.params.id },
        })

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
                passwordExpired: null
              },
            })
            return res.sendStatus(200)
          }
        } catch (error) {
          return res.status(400).send({ error: 'a error occurred: ' + error })
        }
      }
      return res.status(200).json({ status: true })
    } catch (error) {
      return res.status(400).send({ error: 'a error occurred: ' + error })
    }
  },
}

export default recoverPassword;
