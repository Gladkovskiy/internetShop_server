import express from 'express'

import * as brandController from '../controllers/brandController.js'

const router = new express.Router()

router.post('/', brandController.create)
router.get('/', brandController.getAll)

export default router
