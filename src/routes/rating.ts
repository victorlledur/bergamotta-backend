import express from "express";
import ratingController from "../controllers/rating";

const routes = express.Router();

routes.post("/createrating", ratingController.createRating);
routes.get("/ratings", ratingController.listRatings);
routes.get("/rating/:id", ratingController.byIdRating);
routes.put("/rating/:id", ratingController.updateRating);
routes.delete("/rating/:id", ratingController.deleteRating);

export default routes;
