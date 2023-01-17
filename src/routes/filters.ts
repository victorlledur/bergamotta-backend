import express, { Request, Response } from "express";
import filterController from "../controllers/filter";

const routes = express.Router();


routes.post("/filter", filterController.filters);

routes.get("/search", filterController.searchPlaces);

export default routes;