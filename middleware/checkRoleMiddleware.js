import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import ApiError from '../error/ApiError.js'

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
      if (jwtToken === 'null') {
        next(ApiError.unauthorized('Пользователь не авторизован'))
      }

      //декодируем токен получаем id, email, role
      const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY)

      //забераем role из декодированого токена
      if (decoded.role !== role) {
        next(ApiError.forbidden('У вас нет доступа'))
      }

      next()
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }
}

export default roleVerify
