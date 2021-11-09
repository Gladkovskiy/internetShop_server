import express from 'express'

import * as raytingController from '../controllers/raytingController.js'
import checkRole from '../middleware/checkRoleMiddleware.js'

const router = new express.Router()

router.post('/', checkRole('ADMIN'), raytingController.create)

export default router
