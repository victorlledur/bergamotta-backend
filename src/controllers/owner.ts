import { NextFunction, Request, Response } from 'express'
import { prisma } from '../database/index'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import verifyEmail from '../helpers/emailcheck'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'

const secret = process.env.SECRET_KEY as string

const ownerController = {
  async verifyPassword(password: string) {
    if(password){
      const hash = await bcrypt.hash(password, 10)
      return hash
    }
    return password
  },

  async createOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      if (await verifyEmail(email))
        return res.status(400).send({ message: 'This email already exists' })

      const hash = await bcrypt.hash(password, 10)

      const newOwner = await prisma.owner.create({
        data: { ...req.body, password: hash },
      })

      return res.status(200).json({
        newOwner,
        token: decodeAndGenerateToken.generateToken({
          id: newOwner.id,
          name: newOwner.name,
          email: newOwner.email,
          password: newOwner.password
        }),
      })
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  },

  async listOwners(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await prisma.owner.findMany()
    //   const list2 = list.map( x =>  x.city )
    // const list2 = list.slice( 0, 2)
      return res.status(200).json(list)
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  },

  async byIdOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const ownerId = await prisma.owner.findUnique({
        where: {
          id,
        },
      })

      if (!ownerId) {
        return res.status(404).json("This ID doesn't exist")
      }

      return res.status(200).json(ownerId)
    } catch (error) {
      return res.status(400).json({ error: error })
    }
  },

  async updateOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      // const {
      //   name,
      //   email,
      //   password,
      //   image_link,
      //   cnpj,
      //   role,
      //   city,
      //   state,
      //   country,
      // } = req.body
      
      const ownerId = await prisma.owner.findUnique({
        where: {
          id,
        },
      })
      
      if (!ownerId) {
        return res.status(404).json("This ID doesn't exist")
      }

      if(req.body.email){
        if (await verifyEmail(req.body.email))
          return res.status(400).send({ message: 'This email already exists' })
      }
        
      await prisma.owner.update({
        where: {
          id,
        },
        data: { ...req.body, password: await ownerController.verifyPassword(req.body.password)},
      })
      
      return res.status(200).json({
        ownerId,
        token: decodeAndGenerateToken.generateToken({
          id: ownerId.id,
          name: ownerId.name,
          email: ownerId.email,
          password: ownerId.password,
          passwordReset: ownerId.passwordReset,
          passwordExpired: ownerId.passwordExpired
        }),
      })
    } catch (error) {
      return res.status(400).json({ error: error })
    }
  },

  async deleteOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const ownerId = await prisma.owner.findUnique({
        where: {
          id,
        },
      })

      if (!ownerId) {
        return res.status(404).json("This ID doesn't exist")
      }

      await prisma.owner.delete({
        where: {
          id,
        },
      })

      return res.sendStatus(200)
    } catch (error) {
      return res.status(400).json({ error: error })
    }
  },

}

export default ownerController
