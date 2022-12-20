import express, { Request, Response } from "express";
import recipeController from "../controllers/recipe";

const routes = express.Router();

routes.get("/", (req: Request, res: Response) => {
     return res.json("Api receitas rodando")
});

routes.post("/createrecipe", recipeController.createRecipe);
routes.get("/listrecipes", recipeController.listRecipes);
routes.get("/byidrecipes/:id", recipeController.byIdRecipe);
routes.put("/updaterecipe/:id", recipeController.updateRecipe);
routes.delete("/recipe/:id", recipeController.deleteRecipe);

export default routes