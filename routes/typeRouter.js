import express from 'express'

import * as typeController from '../controllers/typeController.js'

const router = new express.Router()

router.post('/', typeController.create)
router.get('/', typeController.getAll)

export default router
