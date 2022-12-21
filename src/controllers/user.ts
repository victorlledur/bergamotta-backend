import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";


const userController = {

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password, image_link, city, state, country} = req.body;
                

            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: password,
                    image_link: image_link,
                    city: city,
                    state: state,
                    country: country,
                }
            });

            res.status(201).json(newUser)

        } catch (error) {
            next(error)
        }
    },

    async listUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const listUsers = await prisma.user.findMany();
            res.status(200).json(listUsers);
        } catch (error) {
            next(error);
        }
    },

    async byIdUser(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: {
                    id,
                }
            });

            if (!user) {
                res.status(404).json("User not found")
            };

            res.status(200).json(user)

        } catch (error) {
            next(error)
        }

    },

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, email, password, image_link, city, state, country} = req.body;

            const user = await prisma.user.findUnique({
                where: {
                    id,
                }
            });

            if (!user) {
                res.status(400).json("User not found")
            };

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

            res.status(200).json({ result: updated})
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
                res.status(404).json("User not found")
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