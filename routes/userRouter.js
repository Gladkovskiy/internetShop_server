import express from 'express'

import * as userController from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import checkRole from '../middleware/checkRoleMiddleware.js'

const router = new express.Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/basket', checkRole('ADMIN'), userController.getBasket)
router.post('/basket', checkRole('ADMIN'), userController.addDeviceToBasket)
router.get(
  '/basketDevices',
  checkRole('ADMIN'),
  userController.showDevicesInBasket
)
router.delete(
  '/basket',
  checkRole('ADMIN'),
  userController.deleteDeviceInBasket
)

export default router
