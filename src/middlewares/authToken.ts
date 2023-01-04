import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
const secret = process.env.SECRET_KEY as string
import { prisma } from '../database/index'

export const validateToken = {
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
            
            if (err) 
              return res.status(401).send({ error: err.message })

            try {
              const findUser = await prisma.owner.findUnique({
                where: {
                  id,
                },
              })
    
              if (!findUser) return res.sendStatus(401)
              
              if (!decoded.id)
                return res.status(401).send({ error: 'No ID available' })
    
              if (decoded.id !== id || decoded.email !== findUser.email)
                return res.status(200).send({
                  error: 'This Token has not belong to the specified payload',
                })

              if (Number(findUser.passwordExpired) < Date.now())
                return res.status(200).send({ error: 'password expired' })
    
              console.log('Authenticate via headers!')
    
              return next()
            } catch (error: any) {
              return res.status(401).send({ error: error.message })
            }
          })
      } catch (error: any) {
        return res.status(401).send({ error: error.message })
      }
    } else {
      jwt.verify(mailToken, secret, async (err: any, decoded: any) => {
        const { id } = req.params

        if (err) return res.status(401).send({ error: err.message })
        try {
          const findUser = await prisma.owner.findUnique({
            where: {
              id,
            },
          })

          if (!findUser) return res.sendStatus(401)
          if (!decoded.id)
            return res.status(401).send({ error: 'No ID available' })

          if (decoded.id !== id || decoded.email !== findUser.email)
            return res.status(200).send({
              error: 'This Token has not belong to the specified payload',
            })

          if (!(findUser.passwordExpired! > Date.now()))
            return res.status(200).send({ error: 'password expired' })

          console.log('Authenticate via params!')

          return next()
        } catch (error: any) {
          return res.status(401).send({ error: error.message })
        }
      })
    }
  },
}

