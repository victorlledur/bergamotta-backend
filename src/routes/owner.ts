import express, { Request, Response } from "express";
import ownerController from "../controllers/owner";

const routes = express.Router();

routes.post("/owner", ownerController.store);
routes.get("/owner", ownerController.listAll);
routes.get("/owner/:id", ownerController.listById);
routes.put("/owner/:id", ownerController.update);
routes.delete("/owner/:id", ownerController.remove);

export default routes;