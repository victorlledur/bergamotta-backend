import express, { Request, Response } from "express";
import placeController from "../controllers/place";
import { SUCCESS } from "../constants/success";

const routes = express.Router();

routes.get("/", (req:Request, res:Response) =>{
    return res.json(SUCCESS.ROUTES.API);
});

routes.post("/createplace", placeController.createPlace);
routes.get("/places", placeController.listPlaces);
routes.get("/place/:id", placeController.byIdPlace);
routes.put("/place/:id", placeController.updatePlace);
routes.delete("/place/:id", placeController.deletePlace);
routes.get("/placebyowner/:id", placeController.placeByOwnerId);

export default routes; 