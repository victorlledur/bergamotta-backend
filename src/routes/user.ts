import express from "express";
import userController from "../controllers/user";
import { validateToken } from '../middlewares/authToken';
import validateUser from "../validations/validateUser";

const routes = express.Router();

routes.post("/createuser", validateUser, userController.createUser);
routes.get("/users",  userController.listUsers);
routes.get("/user/:id",  userController.byIdUser);
routes.put("/user/:id", userController.updateUser);
routes.delete("/user/:id", validateToken.function, userController.deleteUser);

export default routes;