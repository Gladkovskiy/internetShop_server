import express from 'express'

import * as deviceController from '../controllers/deviceController.js'

const router = new express.Router()

router.post('/', deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)

export default router
