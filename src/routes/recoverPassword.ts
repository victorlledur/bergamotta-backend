import express from "express";
import recoverPassword from "../controllers/recoverPassword";
import { validateToken } from "../middlewares/authToken";

const routes = express.Router();

routes.put('/users/forget-password', recoverPassword.forgetPassword)
routes.get('/users/reset-password/:id/:token', validateToken.function, recoverPassword.resetPassword);
routes.put('/users/reset-password/:id', validateToken.function, recoverPassword.resetPassword);

export default routes;