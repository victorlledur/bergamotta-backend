import express, { Request, Response } from "express";
import blogCommentController from "../controllers/blogComment";

const routes = express.Router();

routes.post("/:id/createblogcomment", blogCommentController.createBlogComment);
routes.get("/blogcomments", blogCommentController.listBlogComment);
routes.get("/blogcomment/:id", blogCommentController.byIdBlogComment);
routes.put("/blogcomment/:id", blogCommentController.updateBlogComment);
routes.delete("/blogcomment/:id", blogCommentController.deleteBlogComment);


export default routes;