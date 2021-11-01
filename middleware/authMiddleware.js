import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const tokenValid = (req, res, next) => {
  try {
    //Пишим этот middleware для добавление в req.user декодированный токен
    //проверяем тип метода
    if (req.method === 'OPTIONS') {
      next()
    }
    //из хэдера запроса забераем токен
    const jwtToken = req.headers.authorization.split(' ')[1] //токен 2е слово
    //если токена нет то пшим сообщение не авторизирован

    if (jwtToken === 'null') {
      console.log(jwtToken)
      return res.status(401).json({message: 'Пользователь не авторизован'})
    }

    //декодируем токен получаем id, email, role
    const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY)

    //добавляем в запрос и передаём в userController
    //добавляем userRouter.js в route /auth перед chek
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json(error.message)
  }
}

export default tokenValid
