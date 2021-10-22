import express from 'express'

import * as deviceController from '../controllers/deviceController.js'
import checkRole from '../middleware/checkRoleMiddleware.js'

const router = new express.Router()

router.post('/', checkRole('ADMIN'), deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)

export default router
