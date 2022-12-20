import express, { Request, Response } from "express";
import placeController from "../controllers/place";

const routes = express.Router();

routes.get("/", (req:Request, res:Response) =>{
    return res.json("API MODIFIED");
});

routes.post("/createplace", placeController.createPlace);
routes.get("/places", placeController.listPlaces);
routes.get("/place/:id", placeController.byIdPlace);
routes.put("/place/:id", placeController.updatePlace);
routes.delete("/place/:id", placeController.deletePlace);

routes.get("/placeswhere", placeController.listPlaceswhere);

export default routes;