import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";
import decodeAndGenerateToken from "../helpers/decodeAndGenerateToken";
import { ERRORS } from "../constants/error";

const favoritesController = {

    async createFavorite(req: Request, res: Response, next: NextFunction) {
        try {
            const { place_id } = req.body;
            const user_id = req.params.id

            const newUser = await prisma.favorites.create({
                data: {
                    user_id: user_id,
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
                res.status(404).json(ERRORS.CONTROLLERS.FAVORITES.FAV_NOT_FOUND)
            };

            res.status(200).json(favorite)

        } catch (error) {
            next(error)
        }
    },

    async userFavoritesById(req: Request, res: Response, next: NextFunction) {
        try {

            const user_id = req.params.id

            const favorites = await prisma.favorites.findMany({
                where: {
                    user_id,
                },
                include: {
                    place: {
                        select: {
                            id: true,
                            image_link: true,
                            name: true,
                            opening_hours: true,
                            average_ticket_price: true
                        }
                    }
                }
            });

            if (!favorites) {
                res.status(404).json(ERRORS.CONTROLLERS.FAVORITES.FAV_NOT_FOUND)
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
            const place_id = req.params.id

            const favorite = await prisma.favorites.findMany({
                where: {
                    user_id: { in :user_id },
                    place_id: { in: place_id }
                }
            });           

            if (!favorite) {
                res.status(404).json(ERRORS.CONTROLLERS.FAVORITES.FAV_NOT_FOUND)
            };

            res.status(200).json(favorite)

        } catch (error) {
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
                res.status(400).json(ERRORS.CONTROLLERS.FAVORITES.FAV_NOT_FOUND)
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

            res.status(200).json({ result: updated })
        } catch (error) {
            next(error)

        }
    },

    async deleteFavorite(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization as string
            const user_id = decodeAndGenerateToken.decodedToken(token)

            const favorite = await prisma.favorites.findMany({
                where: {
                    user_id: user_id
                }
            });

            const filterUserFavorite = favorite.filter((favorite) => {
                return favorite.place_id === req.params.place_id
            })

            if (!filterUserFavorite) {
                res.status(404).json(ERRORS.CONTROLLERS.FAVORITES.USER_NOT_FOUND)
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