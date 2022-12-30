import express from "express";
import recipeController from "../controllers/recipe";

const routes = express.Router();

routes.post("/createrecipe", recipeController.createRecipe);
routes.get("/recipes", recipeController.listRecipes);
routes.get("/recipe/:id", recipeController.byIdRecipe);
routes.put("/recipe/:id", recipeController.updateRecipe);
routes.delete("/recipe/:id", recipeController.deleteRecipe);

export default routes