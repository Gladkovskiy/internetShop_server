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
const roleVerify = role => {
  return (req, res, next) => {
    try {
      //Пишим этот middleware декодированния токена и получения role
      //проверяем тип метода
      if (req.method === 'OPTIONS') {
        next()
      }
      //из хэдера запроса забераем токен
      const jwtToken = req.headers.authorization.split(' ')[1] //токен 2е слово
      //если токена нет то пшим сообщение не авторизирован

      if (!jwtToken) {
        return res.status(401).json({message: 'Пользователь не авторизован'})
      }

      //декодируем токен получаем id, email, role
      const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY)

      //забераем role из декодированого токена
      if (decoded.role !== role) {
        return res.status(403).json({message: 'У вас нет доступа'})
      }

      next()
    } catch (error) {
      res.status(401).json(error.message)
    }
  }
}

export default roleVerify
