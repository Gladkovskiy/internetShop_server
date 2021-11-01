import express from 'express'

import {Brand} from '../models/models.js'
import ApiError from '../error/ApiError.js'

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const create = async (req, res) => {
  const {name} = req.body
  //записуем в поле name таблицы brand в БД
  const brand = await Brand.create({name})
  res.json(brand)
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getAll = async (req, res) => {
  //забираем все записи с таблицы brand БД
  const brand = await Brand.findAll()
  res.json(brand)
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const deleteOne = async (req, res) => {
  const {name} = req.body
  //удаляем запись из БД
  const brand = await Brand.destroy({where: {name}})
  res.json(brand)
}
