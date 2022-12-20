import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";
import bcrypt  from "bcrypt"
import jwt from 'jsonwebtoken'

const secret = process.env.SECRET_KEY as string;

const ownerController = {

    verifyEmail: async function(email: string){
        return await prisma.owner.findUnique({
            where: {
                email
            }
        }) ? true : false;
    },

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const { 
                name,
                email,
                password,
                image_link,
                city,
                state,
                country
            } = req.body;

            if( await ownerController.verifyEmail(email) )
                return res.status(400).send( { message: "This email already exists" } );

            const hash = await bcrypt.hash(password, 10)
            
            const newOwner = await prisma.owner.create({
                data: {
                    name,
                    email,
                    password: hash,
                    image_link,
                    city,
                    state,
                    country
                }
            });
            
            return res.status(200).json(newOwner)

        } catch (error) {
            return res.status(400).send({ error: error });
        }
    },

    async listAll(req: Request, res: Response, next: NextFunction) {
        try {
            const list = await prisma.owner.findMany();
            return res.status(200).json(list);
        } catch (error) {
            return res.status(400).send({ error: error});
        }
    },

    async listById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const ownerId = await prisma.owner.findUnique({
                where: {
                    id,
                }
            });

            if (!ownerId) {
                return res.status(404).json("This ID doesn't exist")
            }

            return res.status(200).json(ownerId)

        } catch (error) {
            return res.status(400).json({ error: error});
        }

    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const { 
                name,
                email,
                password,
                image_link,
                city,
                state,
                country
            } = req.body;

            const ownerId = await prisma.owner.findUnique({
                where: {
                    id,
                }
            });

            if (!ownerId) {
                return res.status(404).json("This ID doesn't exist")
            }

            if( await ownerController.verifyEmail(email) )
                return res.status(400).send( { message: "This email already exists" } );

            await prisma.owner.update({
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
                    country
                },
            });

            return res.sendStatus(200);
        } catch (error) {
            return res.status(400).json({ error: error});
        }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const ownerId = await prisma.owner.findUnique({
                where: {
                    id,
                }
            });

            if (!ownerId) {
                return res.status(404).json("This ID doesn't exist")
            }

            await prisma.owner.delete({
                where: {
                    id,
                },
            });

            return res.sendStatus(200)

        } catch (error) {
            return res.status(400).json({ error: error});
        }
    },
};


export default ownerController;