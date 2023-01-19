import express from "express";
import authControllerOwner from "../controllers/authControllerOwner";
import authControllerUser from "../controllers/authControllerUser";
import validateLogin from "../validations/validateLogin";

const routes = express.Router();

routes.post("/ownerauthentication", validateLogin, authControllerOwner.authOwner)
routes.post("/userauthentication", validateLogin, authControllerUser.authUser)

export default routes;