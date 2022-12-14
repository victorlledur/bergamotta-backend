import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";
import bcrypt from "bcrypt"
import verifyEmail from "../helpers/emailcheck"
import decodeAndGenerateToken from '../helpers/decodeAndGenerateToken'

const userController = {
    async verifyPassword(password: string) {
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
            return res.status(400).send({ message: 'This email already exists' })
    
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
            } //para não exibir a senha resete e expired

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
                return res.status(404).json("User not found")
            };

            const { passwordReset, passwordExpired, ...user } = userId //para não exibir a senha resete e expired

            return res.status(200).json(user)
        } catch (error) {
          return res.status(400).json({ error: error })
        }

    },

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
          const { id } = req.params
    
          const userId = await prisma.user.findUnique({
            where: {
              id,
            },
          })
    
          if (!userId) {
            return res.status(404).json("This ID doesn't exist")
          }
    
          if (req.body.email) {
            if (await verifyEmail(req.body.email))
              return res.status(400).send({ message: 'This email already exists' })
          }
    
          await prisma.user.update({
            where: {
              id,
            },
            data: {
              ...req.body,
              password: await userController.verifyPassword(req.body.password),
            },
          })
    
          return res.status(200).json({
            userId,
            token: decodeAndGenerateToken.generateToken({
              id: userId.id,
              name: userId.name,
              email: userId.email,
              password: userId.password,
              passwordReset: userId.passwordReset,
              passwordExpired: userId.passwordExpired,
            }),
          })
        } catch (error) {
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
            return res.status(404).json("This ID doesn't exist")
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