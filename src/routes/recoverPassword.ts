import express from "express";
import recoverOwnerPassword from "../controllers/recoverOwnerPassword";
import recoverUserPassword from "../controllers/recoverUserPassword";
import { validateToken } from "../middlewares/authToken";

const routes = express.Router();

//users routes
routes.put('/forgetpassword-user', recoverUserPassword.forgetPassword)
routes.get('/resetpassword-user/:id/:token', validateToken.function, recoverUserPassword.resetPassword);
routes.put('/resetpassword-user/:id', validateToken.function, recoverUserPassword.resetPassword);

//owners routes
routes.put('/forgetpassword-owner', recoverOwnerPassword.forgetPassword)
routes.get('/resetpassword-owner/:id/:token', validateToken.function, recoverOwnerPassword.resetPassword);
routes.put('/resetpassword-owner/:id', validateToken.function, recoverOwnerPassword.resetPassword);

export default routes;  