import { Router } from "express";
import placeRoutes from "./place";
import ownerRoutes from "./owner";
import authentication from "./authentication";
import recipeRoutes from "./recipe"

const routes = Router();

routes.use(placeRoutes);
routes.use(ownerRoutes)
routes.use(authentication)
routes.use(recipeRoutes);
export default routes;