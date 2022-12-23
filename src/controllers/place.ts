import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";
import getCoordinates from "../helpers/geocoding";



const placeController = {

    async createPlace(req: Request, res: Response, next: NextFunction) {
        try {
            const { owner_id, name, place_types, food_types, place_profiles, city, state, country, zipcode, district, street, place_number, complement, image_link,
                capacity, description, phone,average_ticket_price, payment, } = req.body;
                                    
                const coordenates: Array<string> = await getCoordinates(`${place_number} ${street} ${city} ${state} ${country}`)
                const lat = `${coordenates[0]}`;
                const lon = `${coordenates[1]}`;

            const newPlace = await prisma.place.create({
                data: {
                    owner_id: owner_id,
                    name: name,
                    place_types: {
                        connect:
                            place_types.map((x: any) => ({ id: x })),
                    },
                    food_types: {
                        connect:
                            food_types.map((x: any) => ({ id: x })),
                    },
                    place_profiles: {
                        connect:
                            place_profiles.map((x: any) => ({ id: x })),
                    },
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
                    average_ticket_price: average_ticket_price,
                    payment: payment,
                    latitude: lat,
                    longitude: lon
                },
                include: {
                    place_types: true,
                    food_types: true,
                    place_profiles: true
                },
            });

            res.status(201).json(newPlace)

        } catch (error) {
            console.log(error)
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
            const { owner_id, name, place_types_ids, food_types_ids, place_profiles_ids, city, state, country, zipcode, district, street, place_number, complement, image_link,
                capacity, description, phone, average_ticket_price, payment, latitude, longitude } = req.body;

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
                    place_types_ids,
                    food_types_ids,
                    place_profiles_ids,
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
                    average_ticket_price,
                    payment,
                    latitude,
                    longitude,
                },
            });

            res.status(200).json({ result: updated })
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
}


export default placeController