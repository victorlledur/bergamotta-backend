import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";
import bcrypt from "bcrypt"
import verifyEmail from "../helpers/emailcheck"
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'
import { ERRORS } from "./../constants/error"

const userController = {
  async hasPassword(password: string) {
    if (password) {
      const hash = await bcrypt.hash(password, 10)
      return hash
    }
    return password
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      if (await verifyEmail(email))
        return res.status(400).send({ message: ERRORS.CONTROLLERS.USER.EMAIL_EXIST })

      const hash = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: { ...req.body, password: hash },
      })

      return res.status(201).json({
        newUser,
        token: decodeAndGenerateToken.generateToken({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          image_link: newUser.image_link,
          city: newUser.city,
          state: newUser.state,
          country: newUser.country,
        })
      })
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  },

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const listUsers = await prisma.user.findMany();
      let newList = [{}];

      for (const item in listUsers) {
        const { passwordReset, passwordExpired, ...user } = listUsers[item]
        newList.push(user)
      }

      return res.status(200).json(listUsers);
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  },

  async byIdUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const userId = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!userId) {
        return res.status(404).json(ERRORS.CONTROLLERS.USER.USER_NOT_FOUND)
      };

      const { passwordReset, passwordExpired, ...user } = userId
      return res.status(200).json(user)
    } catch (error) {
      return res.status(400).json({ error: error })
    }

  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { name, email, password, image_link, city, state, country } = req.body;
      
      if (!id) {
        return res.status(404).json(ERRORS.CONTROLLERS.USER.NO_ID)
      };

      const updated = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          password: await userController.hasPassword(password),
          image_link,
          city,
          state,
          country,
        },
      });

      return res.status(200).json(updated)

    }
    catch (error: any) {
      return res.status(400).json({ error: error })
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const userId = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!userId) {
        return res.status(404).json(ERRORS.CONTROLLERS.USER.NO_ID)
      }

      await prisma.user.delete({
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

export default userController