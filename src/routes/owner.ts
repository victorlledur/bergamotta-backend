import express from 'express'
import ownerController from '../controllers/owner'
import { validateToken } from '../middlewares/authToken'

const routes = express.Router()

routes.post('/owner', ownerController.createOwner)
routes.get('/owner', ownerController.listOwners)
routes.get('/owner/:id', ownerController.byIdOwner)
routes.put('/owner/:id', ownerController.updateOwner)
routes.delete('/owner/:id', validateToken.function, ownerController.deleteOwner)

export default routes
