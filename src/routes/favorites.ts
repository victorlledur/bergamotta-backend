import express, { Request, Response } from "express";
import favoritesController from "../controllers/favorites";

const routes = express.Router();


routes.post("/createfarorite", favoritesController.createFavorite);
routes.get("/favorites", favoritesController.listFavorites);
routes.get("/favorite/:id", favoritesController.byIdFavorite);
routes.put("/favorite/:id", favoritesController.updatefavorite);
routes.delete("/favorite/:id", favoritesController.deleteFavorite);


export default routes;