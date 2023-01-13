import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
const secret = process.env.SECRET_KEY as string
import { prisma } from '../database/index'
import userOrOwner from '../helpers/userOrOwner'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'

export const validateToken = {

  viaHeadersOrParams: function(headersToken: string , paramsToken: string): string | null  {
    if(headersToken){
      return headersToken
    }
    if(paramsToken){
      return paramsToken
    }
    return null
  },

  function(req: Request, res: Response, next: NextFunction) {
    let headersToken: string

    if (!req.params.token) {
      
        if (!req.headers.authorization) {
          return res.status(401).send({ error: 'No token provided!' })
        }
        const parts = req.headers.authorization.split(' ')

        if (!(parts.length === 2))
          return res.status(401).send({ error: 'Token invalid!' })

        const [scheme, token] = parts
        headersToken = token
        if (!/^Bearer$/.test(scheme))
          return res.status(401).send({ error: 'Is not a bearer token' })
          
      }
      const token = validateToken.viaHeadersOrParams(headersToken!, req.params.token) as string
      console.log('token :>> ', token);
      const decodedToken = decodeAndGenerateToken.decodedToken(token)
      
      console.log('decodedToken ID :>> ', decodedToken.id);

      jwt.verify(token, secret, async (err: any, decoded: any) => {
      try {
        const { id } = req.params
        if (err) return res.status(401).send({ error: err.message })

        let find: any

        const status = await userOrOwner.byId(id)
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

        // if (findUser.password !== decoded.password) {
        //   if (Number(findUser.passwordExpired) < Date.now()) {
        //     return res.status(200).send({ error: 'password expired' })
        //   }
        //   return res.status(401).send({ error: 'password mismatch' })
        // }

        console.log('Authenticate !')

        return next()
      } catch (error: any) {
        return res.status(401).send({ error: error.message })
      }
    })
  },
}

