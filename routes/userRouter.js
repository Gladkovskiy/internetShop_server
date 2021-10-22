import express from 'express'

import * as userController from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = new express.Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)

export default router
