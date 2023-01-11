import { Router } from "express";
import placeRoutes from "./place";
import userRoutes from "./user";
import ownerRoutes from "./owner";
import authentication from "./authentication";
import recipeRoutes from "./recipe"
import ratingRoutes from "./rating"
import blogCommentRoutes from "./blogComent"
import favoritesRoutes from "./favorites"
import recoverPassword from "./recoverPassword";
import filter from "./filters"
const routes = Router();

routes.use(placeRoutes);
routes.use(userRoutes);
routes.use(ownerRoutes);
routes.use(authentication);
routes.use(recipeRoutes);
routes.use(ratingRoutes);
routes.use(blogCommentRoutes);
routes.use(favoritesRoutes);
routes.use(recoverPassword);
routes.use(filter);


export default routes;