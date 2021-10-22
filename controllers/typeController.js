import express from 'express'

import {Type} from '../models/models.js'
import ApiError from '../error/ApiError.js'

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const create = async (req, res) => {
  const {name} = req.body
  //записуем в поле name таблицы Type в БД
  const type = await Type.create({name})
  return res.json(type)
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getAll = async (req, res) => {
  //забираем все записи с таблицы Type БД
  const type = await Type.findAll()
  return res.json(type)
}
