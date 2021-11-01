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
  res.json(type)
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getAll = async (req, res) => {
  //забираем все записи с таблицы Type БД
  const type = await Type.findAll()
  //сортировка массива с объектами по свойству name алфавит
  type.sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (nameA < nameB)
      //сортируем строки по возрастанию
      return -1
    if (nameA > nameB) return 1
    return 0 // Никакой сортировки
  })
  res.json(type)
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const deleteOne = async (req, res) => {
  const {name} = req.body
  //удаляем запись из БД
  const type = await Type.destroy({where: {name}})
  res.json(type)
}
