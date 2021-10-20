import express from 'express'

const router = new express.Router()

router.post('/registration')
router.post('/login')
router.get('/auth', (req, res) => {
  res.status(200).json({message: 'ALL WORKING'})
})

export default router
