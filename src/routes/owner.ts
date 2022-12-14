import express from 'express'
import ownerController from '../controllers/owner'
import authController from '../controllers/authController'
import { validateToken } from '../middlewares/authToken'
import { NextFunction, Request, Response } from 'express'
// const validToken = new validateToken();
const routes = express.Router()

routes.post('/owner', ownerController.createOwner)
routes.get('/owner', ownerController.listOwners)
routes.get('/owner/:id', validateToken.function, ownerController.byIdOwner)
routes.put('/owner/:id', validateToken.function, ownerController.updateOwner)
routes.delete('/owner/:id', validateToken.function, ownerController.deleteOwner)

export default routes
