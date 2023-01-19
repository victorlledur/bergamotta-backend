import express from "express";
import placeController from "../controllers/place";

const routes = express.Router();

routes.post("/createplace", placeController.createPlace);
routes.get("/places", placeController.listPlaces);
routes.get("/place/:id", placeController.byIdPlace);
routes.put("/place/:id", placeController.updatePlace);
routes.delete("/place/:id", placeController.deletePlace);
routes.get("/placebyowner/:id", placeController.placeByOwnerId);

export default routes; 