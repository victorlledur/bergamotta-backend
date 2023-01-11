import { NextFunction, Request, Response } from "express";
import { prisma, } from "../database/index";


const filterController = {

    async filters(req: Request, res: Response, next: NextFunction) {
        try {
            const { place_types_ids, food_types_ids, place_profiles_ids } = req.body;

            let queryArgs: any = {}


            // if (place_types_ids && place_types_ids.length) {
            //     filterInclude.push("place_types")
            //     place_types_ids.map(function (x: any) {
            //         filterWhere.push({ id: x, })
            //     })
            // }

            if (place_types_ids && place_types_ids.length > 0) {
                place_types_ids.map((x: any) => {
                    queryArgs = {
                        // ...queryArgs,                        
                        place_types: {
                            some: {
                                id: {
                                    equals: x as string
                                }
                            }
                        }
                    }

                });
            }

            if (Object.keys(queryArgs).length) {
                // let places = await prisma.place.findRaw({
                //     filter: queryArgs,
                //     options:{}
                // })
                const places = await prisma.place.findMany({
                    where: queryArgs
                    
                    // include: {
                    //     place_types: true
                    // }
                })
                console.log(queryArgs)


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
}

export default filterController