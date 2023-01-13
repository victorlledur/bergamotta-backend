import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";
import decodeAndGenerateToken from "../helpers/decodeAndGenerateToken";


const favoritesController = {

    async createFavorite(req: Request, res: Response, next: NextFunction) {
        try {
            const { place_id } = req.body;
            const token = req.headers.authorization as string
            const user_id = decodeAndGenerateToken.decodedToken(token)
            const decodedId = user_id    

            const newUser = await prisma.favorites.create({
                data: {
                    user_id: decodedId.id,
                    place_id: place_id
                }
            });

            res.status(201).json(newUser)

        } catch (error) {
            next(error)
        }
    },

    async listFavorites(req: Request, res: Response, next: NextFunction) {
        try {
            const favorites = await prisma.favorites.findMany();
            res.status(200).json(favorites);
        } catch (error) {
            next(error);
        }
    },

    async byIdFavorite(req: Request, res: Response, next: NextFunction) {
        try {
            
            const { id } = req.params;

            const favorite = await prisma.favorites.findUnique({
                where: {
                    id,
                }
            });

            if (!favorite) {
                res.status(404).json("User not found")
            };

            res.status(200).json(favorite)

        } catch (error) {
            next(error)
        }
    },

    async userFavoritesById(req: Request, res: Response, next: NextFunction) {
        try {
            
            const token = req.headers.authorization as string
            const user_id = decodeAndGenerateToken.decodedToken(token)
            const decodedId = user_id
            console.log('user_id :>> ', user_id);
            const favorites = await prisma.favorites.findMany({
                where: {
                    user_id: decodedId.id,
                }
            });

            if (!favorites) {
                res.status(404).json("User not found")
            };

            res.status(200).json(favorites)

        } catch (error) {
            next(error)
        }
    },

    async userFavoriteById(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization as string
            const user_id = decodeAndGenerateToken.decodedToken(token)
            const decodedId = user_id
            
            const favorite = await prisma.favorites.findMany({
                where: {
                    user_id: decodedId.id
                }
            });

            const filterUserFavorite = favorite.filter((favorite) =>{
                return favorite.place_id === req.body.place_id
            })
            
            if (!favorite) {
                res.status(404).json("User not found")
            };

            res.status(200).json(filterUserFavorite)

        } catch (error) {
            console.error(error)
            next(error)
        }
    },

    async updatefavorite(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { user_id, place_id } = req.body;

            const favorite = await prisma.favorites.findUnique({
                where: {
                    id,
                }
            });

            if (!favorite) {
                res.status(400).json("User not found")
            };

            const updated = await prisma.favorites.update({
                where: {
                    id,
                },
                data: {
                    user_id,
                    place_id
                },
            });

            res.status(200).json({ result: updated})
        } catch (error) {
            next(error)

        }
    },

    async deleteFavorite(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization as string
            const user_id = decodeAndGenerateToken.decodedToken(token)
            const decodedId = user_id

            const favorite = await prisma.favorites.findMany({
                where: {
                    user_id: decodedId.id
                }
            });

            const filterUserFavorite = favorite.filter((favorite) =>{
                return favorite.place_id === req.params.place_id
            })

            if (!filterUserFavorite) {
                res.status(404).json("User not found")
            };

            await prisma.favorites.delete({
                where: {
                    id: filterUserFavorite[0].id,
                },
            });

            res.sendStatus(204)

        } catch (error) {
            next(error)
        }
    },

    
}

export default favoritesController;