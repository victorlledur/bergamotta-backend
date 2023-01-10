import express from "express";
import userController from "../controllers/user";
import { validateToken } from '../middlewares/authToken';

const routes = express.Router();

routes.post("/createuser", userController.createUser);
routes.get("/users",  userController.listUsers);
routes.get("/user/:id", validateToken.function, userController.byIdUser);
routes.put("/user/:id", userController.updateUser);
routes.delete("/user/:id", userController.deleteUser);

export default routes;