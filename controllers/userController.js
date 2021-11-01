import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import ApiError from '../error/ApiError.js'
import {User, Basket} from '../models/models.js'

dotenv.config()

//функция для создания токена
const jwtCreate = (id, email, role) => {
  //создаём jwt токен 1й парметр payload: {id: user.id, email, role} для считывание на frontend
  //2й параметр секртеный ключ, 3й параметр время жизни токена
  return jwt.sign({id, email, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 *
 */
export const registration = async (req, res, next) => {
  try {
    const {email, password, role} = req.body

    //проверяем введены ли пароль и почта
    if (!email || !password) {
      next(ApiError.badRequest('Некорректный email или password'))
    }

    //проверяем существует ли такая почта
    const candidate = await User.findOne({where: {email}})
    if (candidate) {
      next(ApiError.badRequest('Пользователь с таким именем существует'))
    }
    console.log(1)
    //хэшируем пароль
    const hashPassword = await bcrypt.hash(password, 5)
    //записуем в базу пользовательскте данные
    const user = await User.create({email, role, password: hashPassword})
    //записуем в базу корзину пользователя
    const basket = await Basket.create({userId: user.id})

    //создаём токен
    const jwtToken = jwtCreate(user.id, user.mail, user.role)

    res.json({token: jwtToken})
  } catch (error) {
    next(ApiError.badRequest(error.message))
  }
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const login = async (req, res, next) => {
  try {
    const {email, password} = req.body

    //ищем пользователя, если нет выводим сообщение что такого нет
    const user = await User.findOne({where: {email}})
    if (!user) {
      next(ApiError.internal('Пользователь с таким именем не найден'))
    }

    //если есть пользователь, сравниваем пароли, не совпали Неверный пароль
    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      next(ApiError.internal('Неверный пароль'))
    }

    //всё совпало генерируем токен и возвращаем на frontend
    const jwtToken = jwtCreate(user.id, user.email, user.role)

    res.json({token: jwtToken})
  } catch (error) {
    next(ApiError.internal(error.message))
  }
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 */
export const check = async (req, res) => {
  //до этого проверили на валидность, если прошёл прошлую authMiddleware
  //то создаём новый токен и передаём на frontEnd
  const token = jwtCreate(req.user.id, req.user.email, req.user.role)
  res.json({token})
}
