import express, { Request, Response } from "express";
import authControllerOwner from "../controllers/authControllerOwner";
import authControllerUser from "../controllers/authControllerUser";

const routes = express.Router();

routes.post("/owner-authentication", authControllerOwner.authOwner)
routes.post("/user-authentication", authControllerUser.authUser)

export default routes;