import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";


const recipeController = {

    async createRecipe(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                introduction, name, subtitle, image_link, ingredients, directions, servings, total_time
            } = req.body;

            const newRecipe = await prisma.recipe.create({
                data: {
                    introduction: introduction,
                    name: name,
                    subtitle: subtitle,
                    image_link: image_link,
                    ingredients: ingredients,
                    directions: directions,
                    servings: servings,
                    total_time: total_time
                }
            });
            res.status(201).json(newRecipe);

        } catch (error) {
            next(error);
        }
    },

    async listRecipes(req: Request, res: Response, next: NextFunction) {
        try {
            const listRecipes = await prisma.recipe.findMany();
            res.status(200).json(listRecipes);
        } catch (error) {
            next(error);
        }
    },

    async byIdRecipe(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = req.params;

            const recipe = await prisma.recipe.findUnique({
                where: {
                    id,
                }
            });

            if (!recipe) {
                res.status(404).json("Recipe not found");
            };

            res.status(200).json(recipe)

        } catch (error) {
            next(error);
        }
    },

    async updateRecipe(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { introduction, name, subtitle, image_link, ingredients, directions, servings, total_time
            } = req.body;

            const recipe = await prisma.recipe.findUnique({
                where: {
                    id,
                }
            });

            if (!recipe) {
                res.status(400).json("Recipe not found");
            };

            const update = await prisma.recipe.update({
                where: {
                    id,
                },
                data: {
                    introduction,
                    name,
                    subtitle,
                    image_link,
                    ingredients,
                    directions,
                    servings,
                    total_time
                }
            });

            res.status(200).json({ result: update })
        } catch (error) {
            next(error);
        }
    },

    async deleteRecipe(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const recipe = await prisma.recipe.findUnique({
                where: {
                    id,
                }
            });

            if (!recipe) {
                res.status(404).json("Place not found");
            };

            await prisma.recipe.delete({
                where: {
                    id,
                }
            });

            res.sendStatus(204)
        } catch (error) {
            next(error);
        }
    },
}

export default recipeController