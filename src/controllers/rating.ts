import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";
import decodeAndGenerateToken from "../helpers/decodeAndGenerateToken";

const ratingController = {
    async createRating(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization as string
            const user_id = decodeAndGenerateToken.decodedToken(token)

            const {
                general_rating,
                welcoming_service,
                ingredient_substitution,
                instagrammable_food,
                tasty_food,
                cozy,
                service_speed,
                comment,
                place_id,
            } = req.body;

            const newRating = await prisma.rating.create({
                data: {
                    general_rating: general_rating,
                    welcoming_service: welcoming_service,
                    ingredient_substitution: ingredient_substitution,
                    instagrammable_food: instagrammable_food,
                    tasty_food: tasty_food,
                    cozy: cozy,
                    service_speed: service_speed,
                    comment: comment,
                    user_id: user_id,
                    place_id: place_id,
                },
            });

            res.status(201).json(newRating);
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    async listRatings(req: Request, res: Response, next: NextFunction) {
        try {
            const listRatings = await prisma.rating.findMany();
            res.status(200).json(listRatings);
        } catch (error) {
            next(error);
        }
    },

    async byIdRating(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const rating = await prisma.rating.findUnique({
                where: {
                    id,
                },
            });

            if (!rating) {
                res.status(404).json("Rating not found");
            }

            res.status(200).json(rating);
        } catch (error) {
            next(error);
        }
    },

    async updateRating(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization as string
            const user_id = decodeAndGenerateToken.decodedToken(token)
            // const { id } = req.params;
            const {
                general_rating,
                welcoming_service,
                ingredient_substitution,
                instagrammable_food,
                tasty_food,
                cozy,
                service_speed,
                comment
            } = req.body;

            const rating = await prisma.rating.findMany({
                where: {
                    user_id: user_id,
                },
            });

            if (!rating) {
                res.status(400).json("Rating not found");
            }
            console.log('rating :>> ', rating);

            const filterUserRating = rating.filter((rating) =>{
                return rating.place_id === req.body.place_id
            })

            const update = await prisma.rating.update({
                where: {
                    id: filterUserRating[0].id,
                },
                data: {
                    general_rating,
                    welcoming_service,
                    ingredient_substitution,
                    instagrammable_food,
                    tasty_food,
                    cozy,
                    service_speed,
                    comment,
                },
            });

            res.status(200).json({ result: update });
        } catch (error) {
            console.log(error)
            next(error);
        }
    },

    async deleteRating(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const rating = await prisma.rating.findUnique({
                where: {
                    id,
                },
            });

            if (!rating) {
                res.status(404).json("Place not found");
            }

            await prisma.rating.delete({
                where: {
                    id,
                },
            });

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    },

    async averageById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const averageRating = await prisma.rating.findMany({
                where: {
                    place_id: id
                },
                select: {
                    general_rating: true
                },                
            });            
            const data = averageRating.map(function(i:any){
                return i.general_rating;
            });

            const initialValue = 0;
            const sumWithInitial = data.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              initialValue
            );

            const average = sumWithInitial / averageRating.length

                res.status(200).json(average);
            } catch (error) {
                next(error);
            }
        },

        async welcomingServiceById(req: Request, res: Response, next: NextFunction) {
            try {
                const { id } = req.params;

                const dataTrue = await prisma.rating.count({
                    where: {
                        place_id: id,
                        welcoming_service: true
                    },                    
                });

                const dataFalse = await prisma.rating.count({
                    where: {
                        place_id: id,
                        welcoming_service: false
                    },                    
                });

                let dataResults = ""

                if(dataFalse >= dataTrue){
                    dataResults = "bad"
                }else{
                    dataResults = "good"
                }

                res.status(200).json(dataResults);
            } catch (error) {
                next(error);
            }
        },

        async ingredientSubstitutionById(req: Request, res: Response, next: NextFunction) {
            try {
                const { id } = req.params;

                const dataTrue = await prisma.rating.count({
                    where: {
                        place_id: id,
                        ingredient_substitution: true
                    },                    
                });

                const dataFalse = await prisma.rating.count({
                    where: {
                        place_id: id,
                        ingredient_substitution: false
                    },                    
                });

                let dataResults = ""

                if(dataFalse >= dataTrue){
                    dataResults = "bad"
                }else{
                    dataResults = "good"
                }

                res.status(200).json(dataResults);
            } catch (error) {
                next(error);
            }
        },

        async instagrammableFoodById(req: Request, res: Response, next: NextFunction) {
            try {
                const { id } = req.params;

                const dataTrue = await prisma.rating.count({
                    where: {
                        place_id: id,
                        instagrammable_food: true
                    },                    
                });

                const dataFalse = await prisma.rating.count({
                    where: {
                        place_id: id,
                        instagrammable_food: false
                    },                    
                });

                let dataResults = ""

                if(dataFalse >= dataTrue){
                    dataResults = "bad"
                }else{
                    dataResults = "good"
                }

                res.status(200).json(dataResults);
            } catch (error) {
                next(error);
            }
        },

        async tastyFoodById(req: Request, res: Response, next: NextFunction) {
            try {
                const { id } = req.params;

                const dataTrue = await prisma.rating.count({
                    where: {
                        place_id: id,
                        tasty_food: true
                    },                    
                });

                const dataFalse = await prisma.rating.count({
                    where: {
                        place_id: id,
                        tasty_food: false
                    },                    
                });

                let dataResults = ""

                if(dataFalse >= dataTrue){
                    dataResults = "bad"
                }else{
                    dataResults = "good"
                }

                res.status(200).json(dataResults);
            } catch (error) {
                next(error);
            }
        },

        async cozyById(req: Request, res: Response, next: NextFunction) {
            try {
                const { id } = req.params;

                const dataTrue = await prisma.rating.count({
                    where: {
                        place_id: id,
                        cozy: true
                    },                    
                });

                const dataFalse = await prisma.rating.count({
                    where: {
                        place_id: id,
                        cozy: false
                    },                    
                });

                let dataResults = ""

                if(dataFalse >= dataTrue){
                    dataResults = "bad"
                }else{
                    dataResults = "good"
                }

                res.status(200).json(dataResults);
            } catch (error) {
                next(error);
            }
        },

        async serviceSpeed(req: Request, res: Response, next: NextFunction) {
            try {
                const { id } = req.params;

                const dataTrue = await prisma.rating.count({
                    where: {
                        place_id: id,
                        service_speed: true
                    },                    
                });

                const dataFalse = await prisma.rating.count({
                    where: {
                        place_id: id,
                        service_speed: false
                    },                    
                });

                let dataResults = ""

                if(dataFalse >= dataTrue){
                    dataResults = "bad"
                }else{
                    dataResults = "good"
                }

                res.status(200).json(dataResults);
            } catch (error) {
                next(error);
            }
        },

        async RatingByPlaceId(req: Request, res: Response, next: NextFunction) {
            try {
                const place_id = req.params
    
                const listRatingComment = await prisma.rating.findMany({
                    where:{ 
                        place_id: place_id.id, 
                    },                     
                    include:{
                        user: {
                            select: {
                                name: true,
                                image_link: true
                            }
                        }
                    },
                });
                
    
                if (!listRatingComment) {
                    res.status(404).json("Rating not found");
                }
    
                res.status(200).json(listRatingComment);
            } catch (error) {
                next(error);
            }
        },

        
    };

    export default ratingController;
