import express from 'express'

import brandRouter from './brandRouter.js'
import deviceRouter from './deviceRouter.js'
import typeRouter from './typeRouter.js'
import userRouter from './userRouter.js'
import raytingRouter from './raytingRouter.js'

const router = new express.Router()

//Объединение всех роутеров в один

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/rayting', raytingRouter)

export default router
