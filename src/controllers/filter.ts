import { NextFunction, Request, Response } from "express";
import { prisma, } from "../database/index";
import { Prisma } from "@prisma/client";


const filterController = {

    async filters(req: Request, res: Response, next: NextFunction) {
        try {
            const { place_types_ids, food_types_ids, place_profiles_ids } = req.body;

            let queryArgs: Prisma.PlaceFindManyArgs = {}

            if (place_types_ids && place_types_ids.length > 0) {

                queryArgs.where =
                {
                    ...queryArgs.where,
                    place_types_ids: {
                        hasEvery: place_types_ids
                    }
                }
            }
            if (food_types_ids && food_types_ids.length > 0) {

                queryArgs.where =
                {
                    ...queryArgs.where,
                    food_types_ids: {
                        hasEvery: food_types_ids
                    }
                }
            }
            if (place_profiles_ids && place_profiles_ids.length > 0) {

                queryArgs.where =
                {
                    ...queryArgs.where,
                    place_profiles_ids: {
                        hasEvery: place_profiles_ids
                    }
                }
            }

            if (Object.keys(queryArgs).length) {

                const places = await prisma.place.findMany(queryArgs);

                return res.status(200).json(places);

            } else {
                let places = await prisma.place.findMany({
                });
                res.status(200).json(places);
            }


        } catch (error) {
            console.error(error)
            next(error);
        }
    },

    async searchPlaces(req: Request, res: Response, next: NextFunction) {
        try {

            const query = req.params.q

            const listPlaces = await prisma.place.findMany({
                where: {
                    name: {
                        contains: query,
                    }
                }
            });
            res.status(200).json(listPlaces);
        } catch (error) {
            next(error);
        }
    },
}

export default filterController