import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";


const blogCommentController = {

    async createBlogComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { comment, date, recipe_id, user_id } = req.body;
                

            const newUser = await prisma.blog_comment.create({
                data: {
                    comment: comment,
                    date: date,
                    recipe_id: recipe_id,
                    user_id: user_id
                }
            });

            res.status(201).json(newUser)

        } catch (error) {
            next(error)
        }
    },

    async listBlogComment(req: Request, res: Response, next: NextFunction) {
        try {
            const listBlogComment = await prisma.blog_comment.findMany();
            res.status(200).json(listBlogComment);
        } catch (error) {
            next(error);
        }
    },

    async byIdBlogComment(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = req.params;

            const blogComment = await prisma.blog_comment.findUnique({
                where: {
                    id,
                }
            });

            if (!blogComment) {
                res.status(404).json("User not found")
            };

            res.status(200).json(blogComment)

        } catch (error) {
            next(error)
        }
    },

    async updateBlogComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { comment, date, recipe_id, user_id } = req.body;

            const blogComment = await prisma.blog_comment.findUnique({
                where: {
                    id,
                }
            });

            if (!blogComment) {
                res.status(400).json("User not found")
            };

            const updated = await prisma.blog_comment.update({
                where: {
                    id,
                },
                data: {
                    comment,
                    date,
                    recipe_id,
                    user_id
                },
            });

            res.status(200).json({ result: updated})
        } catch (error) {
            next(error)

        }
    },

    async deleteBlogComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const blog_comment = await prisma.blog_comment.findUnique({
                where: {
                    id,
                }
            });

            if (!blog_comment) {
                res.status(404).json("User not found")
            };

            await prisma.blog_comment.delete({
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

export default blogCommentController