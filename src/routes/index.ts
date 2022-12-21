import { Router } from "express";
import placeRoutes from "./place";
import userRoutes from "./user";

const routes = Router();


routes.use(placeRoutes);
routes.use(userRoutes);


export default routes;