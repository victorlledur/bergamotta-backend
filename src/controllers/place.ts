import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";


const placeController = {

    async createPlace(req: Request, res: Response, next: NextFunction) {
        try {
            const { owner_id, name, place_type_number, food_type_number, place_profile_number, city, state, country, zipcode, district, street, place_number, complement, image_link,
                capacity, description, phone, payment, latitude, longitude} = req.body;
                

            const newPlace = await prisma.place.create({
                data: {
                    owner_id: owner_id ,
                    name: name,
                    place_type_number: place_type_number,
                    food_type_number: food_type_number,
                    place_profile_number: place_profile_number,
                    city: city,
                    state: state,
                    country: country,
                    zipcode: zipcode,
                    district: district,
                    street: street,
                    place_number: place_number,
                    complement: complement,
                    image_link: image_link,
                    capacity: capacity,
                    description: description,
                    phone: phone,
                    payment: payment,
                    latitude: latitude,
                    longitude: longitude
                }
            });

            res.status(201).json(newPlace)

        } catch (error) {
            next(error)
        }
    },

    async listPlaces(req: Request, res: Response, next: NextFunction) {
        try {
            const listPlaces = await prisma.place.findMany();
            res.status(200).json(listPlaces);
        } catch (error) {
            next(error);
        }
    },

    async byIdPlace(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = req.params;

            const place = await prisma.place.findUnique({
                where: {
                    id,
                }
            });

            if (!place) {
                res.status(404).json("Place not found")
            };

            res.status(200).json(place)

        } catch (error) {
            next(error)
        }

    },

    async updatePlace(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { owner_id, name, place_type_number, food_type_number, place_profile_number, city, state, country, zipcode, district, street, place_number, complement, image_link,
                capacity, description, phone, payment, latitude, longitude } = req.body;

            const place = await prisma.place.findUnique({
                where: {
                    id,
                }
            });

            if (!place) {
                res.status(400).json("Place not found")
            };

            const updated = await prisma.place.update({
                where: {
                    id,
                },
                data: {
                    owner_id,
                    name,
                    place_type_number,
                    food_type_number,
                    place_profile_number,
                    city,
                    state,
                    country,
                    zipcode,
                    district,
                    street,
                    place_number,
                    complement,
                    image_link,
                    capacity,
                    description,
                    phone,
                    payment,
                    latitude,
                    longitude,
                },
            });

            res.status(200).json({ result: updated})
        } catch (error) {
            next(error)

        }
    },

    async deletePlace(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const place = await prisma.place.findUnique({
                where: {
                    id,
                }
            });

            if (!place) {
                res.status(404).json("Place not found")
            };

            await prisma.place.delete({
                where: {
                    id,
                },
            });

            res.sendStatus(204)

        } catch (error) {
            next(error)
        }
    },

    async listPlaceswhere(req: Request, res: Response, next: NextFunction) {
        try {
            const listPlaceswhere = await prisma.places_Types.findMany({
                where: {
                 place_type_number: 1
                },                
               });;
            res.status(200).json(listPlaceswhere);
        } catch (error) {
            next(error);
        }
    },
}

export default placeController