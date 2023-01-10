import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
const secret = process.env.SECRET_KEY as string
import { prisma } from '../database/index'

export const validateToken = {
  async userOrOwner(id: string): Promise<string | null> {
    if (await prisma.user.count({ where: { id } })) {
      return 'user'
    }
    if (await prisma.owner.count({ where: { id } })) return 'owner'
    return null
  },
  function(req: Request, res: Response, next: NextFunction) {
    const headersToken = req.headers.authorization
    const mailToken = req.params.token

    if (!mailToken) {
      try {
        if (!headersToken) {
          return res.status(401).send({ error: 'No token provided!' })
        }
        const parts = headersToken.split(' ')

        if (!(parts.length === 2))
          return res.status(401).send({ error: 'Token invalid!' })

        const [scheme, token] = parts

        if (!/^Bearer$/.test(scheme))
          return res.status(401).send({ error: 'Is not a bearer token' })
        jwt.verify(token, secret, async (err: any, decoded: any) => {
          const { id } = req.params
          if (err) return res.status(401).send({ error: err.message })

          try {
            let find: any

            const status = await validateToken.userOrOwner(id)
            if (!status) {
              return res.status(401).send({ error: 'Not found' })
            }
            if (status === 'owner') {
              find = await prisma.owner.findUnique({
                where: { id: req.params.id },
              })
            }
            if (status === 'user') {
              find = await prisma.user.findUnique({
                where: { id: req.params.id },
              })
            }
            if (!find) return res.sendStatus(401)

            if (!decoded.id)
              return res.status(401).send({ error: 'No ID available' })

            if (decoded.id !== id || decoded.email !== find.email)
              return res.status(200).send({
                error: 'This Token has not belong to the specified payload',
              })
          } catch (error: any) {
            return res.status(401).send({ error: error.meta.message })
          }

          // if (findUser.password !== decoded.password) {
          //   if (Number(findUser.passwordExpired) < Date.now()) {
          //     return res.status(200).send({ error: 'password expired' })
          //   }
          //   return res.status(401).send({ error: 'password mismatch' })
          // }

          console.log('Authenticate via headers!')

          return next()
        })
      } catch (error: any) {
        return res.status(401).send({ error: error.message })
      }
    } else {
      jwt.verify(mailToken, secret, async (err: any, decoded: any) => {
        try {
         
            const { id } = req.params
            if (err) return res.status(401).send({ error: err.message })
  
            try {
              let find: any
  
              const status = await validateToken.userOrOwner(id)
              if (!status) {
                return res.status(401).send({ error: 'Not found' })
              }
              if (status === 'owner') {
                find = await prisma.owner.findUnique({
                  where: { id: req.params.id },
                })
              }
              if (status === 'user') {
                find = await prisma.user.findUnique({
                  where: { id: req.params.id },
                })
              }
              if (!find) return res.sendStatus(401)
  
              if (!decoded.id)
                return res.status(401).send({ error: 'No ID available' })
  
              if (decoded.id !== id || decoded.email !== find.email)
                return res.status(200).send({
                  error: 'This Token has not belong to the specified payload',
                })
            } catch (error: any) {
              return res.status(401).send({ error: error.meta.message })
            }
  
            // if (findUser.password !== decoded.password) {
            //   if (Number(findUser.passwordExpired) < Date.now()) {
            //     return res.status(200).send({ error: 'password expired' })
            //   }
            //   return res.status(401).send({ error: 'password mismatch' })
            // }
  
            console.log('Authenticate via headers!')
  
            return next()
          
        } catch (error: any) {
          return res.status(401).send({ error: error.message })
        }
        
      })
    }
  },
}
