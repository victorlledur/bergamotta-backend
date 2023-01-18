import { NextFunction, Request, Response } from 'express'
import { prisma } from '../database/index'
import bcrypt from 'bcrypt'
import verifyEmail from '../helpers/emailcheck'
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'
import { ERRORS } from '../constants/error'

const ownerController = {
  async verifyPassword(password: string) {
    if (password) {
      const hash = await bcrypt.hash(password, 10)
      return hash
    }
    return password
  },

  async createOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      if (await verifyEmail(email))
        return res.status(400).send({ message: ERRORS.CONTROLLERS.OWNER.EMAIL_EXIST })

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
          password: newOwner.password,
        }),
      })
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  },

  async listOwners(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await prisma.owner.findMany()
      let newList = [{}]

      for (const item in list) {
        const { passwordReset, passwordExpired, ...owner } = list[item]
        newList.push(owner)
      }

      return res.status(200).json(newList)
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
        return res.status(404).json(ERRORS.CONTROLLERS.OWNER.NO_ID)
      }

      const { passwordReset, passwordExpired, ...owner } = ownerId

      return res.status(200).json(owner)
    } catch (error) {
      return res.status(400).json({ error: error })
    }
  },

  async updateOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { name, email, password, image_link, cnpj, role, city, state, country } = req.body;

      const hash = await bcrypt.hash(password, 10);

      if (!id) {
        return res.status(404).json(ERRORS.CONTROLLERS.OWNER.NO_ID)
      };

      const updated = await prisma.owner.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          password: hash,
          image_link,
          cnpj,
          role,
          city,
          state,
          country,
        },
      });

      return res.status(200).json(updated)

    }
    catch (error) {
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
        return res.status(404).json(ERRORS.CONTROLLERS.OWNER.NO_ID)
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
