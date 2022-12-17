import { Router } from "express";
import placeRoutes from "./place";

const routes = Router();


routes.use(placeRoutes);


export default routes;