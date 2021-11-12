import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import ApiError from '../error/ApiError.js'
import {User, Basket, BasketDevice, Device} from '../models/models.js'

dotenv.config()

//функция для создания токена
const jwtCreate = (id, email, role, basket) => {
  //создаём jwt токен 1й парметр payload: {id: user.id, email, role} для считывание на frontend
  //2й параметр секртеный ключ, 3й параметр время жизни токена
  return jwt.sign({id, email, role, basket}, process.env.SECRET_KEY, {
    expiresIn: '24h',
  })
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

    //хэшируем пароль
    const hashPassword = await bcrypt.hash(password, 5)
    //записуем в базу пользовательскте данные
    const user = await User.create({email, role, password: hashPassword})
    //записуем в базу корзину пользователя
    const basket = await Basket.create({userId: user.id})

    //создаём токен, в токен корзины айди
    const jwtToken = jwtCreate(user.id, user.mail, user.role, basket.id)

    res.json({token: jwtToken})
  } catch (error) {
    next(ApiError.internal(error.message))
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
      next(ApiError.badRequest('Пользователь с таким именем не найден'))
    }

    //если есть пользователь, сравниваем пароли, не совпали Неверный пароль
    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      next(ApiError.badRequest('Неверный пароль'))
    }

    //считуем корзины id по юзеру
    const basket = await Basket.findOne({where: {userId: user.id}})

    //всё совпало генерируем токен и возвращаем на frontend
    const jwtToken = jwtCreate(user.id, user.email, user.role, basket.id)

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
  const token = jwtCreate(
    req.user.id,
    req.user.email,
    req.user.role,
    req.user.basket
  )
  res.json({token})
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 */
export const getBasket = async (req, res, next) => {
  try {
    const {basketId} = req.query
    const basket = await BasketDevice.findAndCountAll({where: {basketId}})
    res.status(200).json(basket)
  } catch (error) {
    next(ApiError.internal(error.message))
  }
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const addDeviceToBasket = async (req, res, next) => {
  try {
    const {basketId, deviceId} = req.body

    const deviceInBasket = await BasketDevice.create({basketId, deviceId})
    res.status(200).json(deviceInBasket)
  } catch (error) {
    next(ApiError.internal(error.message))
  }
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const showDevicesInBasket = async (req, res, next) => {
  try {
    const {basketId} = req.query

    const devices = await BasketDevice.findAll({
      where: {
        basketId,
      },
      attributes: ['id'],
      include: [{model: Device, attributes: ['id', 'name', 'price']}],
    })
    res.status(200).json(devices)
  } catch (error) {
    next(ApiError.internal(error.message))
  }
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const deleteDeviceInBasket = async (req, res, next) => {
  try {
    const {id} = req.body
    const deleteTrue = await BasketDevice.destroy({where: {id}})

    res.status(200).json({delete: !!deleteTrue})
  } catch (error) {
    next(ApiError.internal(error.message))
  }
}
