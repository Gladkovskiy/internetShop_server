import express from 'express'

import * as brandController from '../controllers/brandController.js'
import checkRole from '../middleware/checkRoleMiddleware.js'

const router = new express.Router()

router.post('/', checkRole('ADMIN'), brandController.create)
router.get('/', brandController.getAll)

export default router
