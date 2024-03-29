import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/index";
import decodeAndGenerateToken from "../helpers/decodeAndGenerateToken";
import moment from "moment-timezone";
import { ERRORS } from "../constants/error";

const blogCommentController = {

    async createBlogComment(req: Request, res: Response, next: NextFunction) {
        try {
            const comment = req.body.comment;
            const dateComment = moment().tz("America/Asuncion")
            const isDst = dateComment.isDST()

            if (isDst) {
                dateComment.subtract(1, "hours")
            }

            const recipe_id = req.params.id
            const token = req.headers.authorization as string
            const { user_id } = req.body

            const newUser = await prisma.blog_comment.create({
                data: {
                    comment: comment,
                    date: moment().tz("America/Sao_Paulo").format(),
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
            listBlogComment.map((comment) => {
                comment.date = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss")
            })
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
                res.status(404).json(ERRORS.CONTROLLERS.BLOG_COMMENTS.USER_NOT_FOUND)
            };
            const newBlogComment = { ...blogComment }
            newBlogComment.date = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss")

            res.status(200).json(newBlogComment)

        } catch (error) {
            next(error)
        }
    },

    async updateBlogComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { comment } = req.body;

            const blogComment = await prisma.blog_comment.findUnique({
                where: {
                    id,
                }
            });

            if (!blogComment) {
                res.status(400).json(ERRORS.CONTROLLERS.BLOG_COMMENTS.USER_NOT_FOUND)
            };

            const updated = await prisma.blog_comment.update({
                where: {
                    id,
                },
                data: {
                    comment
                },
            });

            res.status(200).json({ result: updated })
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
                res.status(404).json(ERRORS.CONTROLLERS.BLOG_COMMENTS.USER_NOT_FOUND)
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

    async listBlogCommentsByRecipeId(req: Request, res: Response, next: NextFunction) {
        try {
            const recipe_id = req.params

            const listBlogComment = await prisma.blog_comment.findMany({
                where: {
                    recipe_id: recipe_id.id
                },
                orderBy: {
                    date: "desc",
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            image_link: true
                        }
                    }
                },
            });
            listBlogComment.map((comment) => {
                comment.date = moment(comment.date).tz("America/Sao_Paulo").format("DD-MM-YYYY HH:mm:ss")
            })
            res.status(200).json(listBlogComment);
        } catch (error) {
            next(error);
        }
    },

}

export default blogCommentController