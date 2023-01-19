import express from "express";
import placeController from "../controllers/place";
import validatePlace from "../validations/validatePlace";

const routes = express.Router();

routes.post("/createplace", validatePlace, placeController.createPlace);
routes.get("/places", placeController.listPlaces);
routes.get("/place/:id", placeController.byIdPlace);
routes.put("/place/:id", placeController.updatePlace);
routes.delete("/place/:id", placeController.deletePlace);
routes.get("/placebyowner/:id", placeController.placeByOwnerId);

export default routes; 