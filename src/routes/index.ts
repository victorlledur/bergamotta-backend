import { Router } from "express";
import placeRoutes from "./place";
import ownerRoutes from "./owner";

const routes = Router();


routes.use(placeRoutes);
routes.use(ownerRoutes)

export default routes;