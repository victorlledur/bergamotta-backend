import express, { Request, Response } from "express";
import authController from "../controllers/authController";

const routes = express.Router();

routes.post("/authentication", authController.authUser)

export default routes;