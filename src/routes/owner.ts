import express, { Request, Response } from "express";
import ownerController from "../controllers/owner";
import authController from "../controllers/authController";
import { validateToken } from '../middlewares/authToken';

const routes = express.Router();

routes.post("/owner", ownerController.store);
routes.get("/owner", ownerController.listAll);
routes.get("/owner/:id", ownerController.listById);
routes.put("/owner/:id", ownerController.update);
routes.delete("/owner/:id", validateToken.function, ownerController.remove);

routes.post("/authentication", authController.authUser)

export default routes;