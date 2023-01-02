import express, { Request, Response } from "express";
import userController from "../controllers/user";
import { validateToken } from '../middlewares/authToken';

const routes = express.Router();

routes.post("/createuser", userController.createUser);
routes.get("/users", validateToken.function, userController.listUsers);
routes.get("/user/:id", validateToken.function, userController.byIdUser);
routes.put("/user/:id", validateToken.function, userController.updateUser);
routes.delete("/user/:id", validateToken.function, userController.deleteUser);


export default routes;