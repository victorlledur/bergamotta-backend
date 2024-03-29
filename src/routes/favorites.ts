import express from "express";
import favoritesController from "../controllers/favorites";

const routes = express.Router();

routes.post("/createfavorite", favoritesController.createFavorite);
routes.get("/favorites", favoritesController.listFavorites);
routes.get("/favorite/:id", favoritesController.byIdFavorite);
routes.put("/favorite/:id", favoritesController.updatefavorite);
routes.get("/userfavorite/:id", favoritesController.userFavoriteById)
routes.get("/userfavorites/:id", favoritesController.userFavoritesById)
routes.delete("/favorite/:place_id", favoritesController.deleteFavorite);

export default routes;