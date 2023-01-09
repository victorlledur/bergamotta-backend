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
            const { name, email, password, image_link, city, state, country } = req.body;

            if (await verifyEmail(email))
                return res.status(400).send({ message: 'This email already exists' })

            const hash = await bcrypt.hash(password, 10)

            const newUser = await prisma.user.create({
                data: { ...req.body, password: hash },
            })

            res.status(201).json({
                newUser,
                token: decodeAndGenerateToken.generateToken({
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
            next(error)
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

            res.status(200).json(listUsers);
        } catch (error) {
            next(error);
        }
    },

    async byIdUser(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = req.params;

            const userId = await prisma.user.findUnique({
                where: {
                    id,
                }
            });

            if (!userId) {
                res.status(404).json("User not found")
            };

            const { passwordReset, passwordExpired, ...user } = userId //para não exibir a senha resete e expired

            return res.status(200).json(user)

        } catch (error) {
            next(error)
        }

    },

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, email, password, image_link, city, state, country } = req.body;

            const user = await prisma.user.findUnique({
                where: {
                    id,
                }
            });

            if (!user) {
                res.status(400).json("User not found")
            };

            if (req.body.email) {
                if (await verifyEmail(req.body.email))
                    return res.status(400).send({ message: 'This email already exists' })
            }

            const updated = await prisma.user.update({
                where: {
                    id,
                },
                data: {
                    name,
                    email,
                    password,
                    image_link,
                    city,
                    state,
                    country,
                },
            });

            res.status(200).json({ result: updated })
        } catch (error) {
            next(error)

        }
    },

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: {
                    id,
                }
            });

            if (!user) {
                return res.status(404).json("User not found")
            };

            await prisma.user.delete({
                where: {
                    id,
                },
            });

            res.sendStatus(204)

        } catch (error) {
            next(error)
        }
    },


}

export default userController