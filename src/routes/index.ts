import { Router } from "express";
import placeRoutes from "./place";
import ownerRoutes from "./owner";
import authentication from "./authentication";

const routes = Router();

routes.use(placeRoutes);
routes.use(ownerRoutes)
routes.use(authentication)

export default routes;