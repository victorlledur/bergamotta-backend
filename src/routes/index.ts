import { Router } from "express";
import placeRoutes from "./place";
import ownerRoutes from "./owner";
import recipeRoutes from "./recipe"

const routes = Router();


routes.use(placeRoutes);
routes.use(ownerRoutes)
routes.use(recipeRoutes);

export default routes;