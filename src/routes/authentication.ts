import express from "express";
import authControllerOwner from "../controllers/authControllerOwner";
import authControllerUser from "../controllers/authControllerUser";

const routes = express.Router();

routes.post("/ownerauthentication", authControllerOwner.authOwner)
routes.post("/userauthentication", authControllerUser.authUser)

export default routes;