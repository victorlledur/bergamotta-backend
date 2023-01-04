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
        
        jwt.verify(token, secret, (err: any, decoded: any) => {
          if (err)
            return res
              .status(401)
              .send({ error: 'This token expired or was not valid' })

          if (!decoded.id)
            return res.status(401).send({ error: 'No id available' })

          if (decoded.id !== req.params.id) {
            console.log('decoded.id ', decoded.id)
            console.log('req.params.id', req.params.id)

            return res
              .status(200)
              .send({ error: 'This Token has not belong to the specified ID' })
          }

          console.log('Authenticate!')
          return next()
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

          if (!(findUser.passwordExpired > Date.now()))
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

// const findUser = await User.findOne({ email: decoded.email })
// console.log(">>>>>>>>>>>"+findUser?.email)

// if (err)
//     return res.status(401).send({ error: 'This token expired or was not valid'});

// if(!(decoded.email || decoded.password))
//     return res.status(401).send({ error: 'No email or password was provided in the token'});

// if(!findUser)
//     return res.status(401).send({ error: 'No user found'});

// if(decoded.email !== findUser.email || decoded.password !== findUser.password)
//     return res.status(200).send({ error: 'This token has not belong to the specified User'})

// console.log("Authenticate user!");
// // console.log({Method: req.method, decoded})
// return next()
