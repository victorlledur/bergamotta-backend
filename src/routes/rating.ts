import express from "express";
import ratingController from "../controllers/rating";

const routes = express.Router();

routes.post("/createrating", ratingController.createRating);
routes.get("/ratings", ratingController.listRatings);
routes.get("/rating/:id", ratingController.byIdRating);
routes.put("/rating", ratingController.updateRating);
routes.delete("/rating/:id", ratingController.deleteRating);
routes.get("/averagerating/:id", ratingController.averageById);
routes.get("/welcomingservice/:id", ratingController.welcomingServiceById);
routes.get("/ingredientsubstitution/:id", ratingController.ingredientSubstitutionById);
routes.get("/instagrammablefood/:id", ratingController.instagrammableFoodById);
routes.get("/tastyfood/:id", ratingController.tastyFoodById);
routes.get("/cozy/:id", ratingController.cozyById);
routes.get("/servicespeed/:id", ratingController.serviceSpeed);

export default routes;
