import express from 'express'

import * as typeController from '../controllers/typeController.js'
import checkRole from '../middleware/checkRoleMiddleware.js'

const router = new express.Router()

router.post('/', checkRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)

export default router
