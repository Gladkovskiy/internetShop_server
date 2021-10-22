import express from 'express'
import {v4 as uuidv4} from 'uuid'
import path from 'path'

import {Device, DeviceInfo} from '../models/models.js'
import ApiError from '../error/ApiError.js'

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const create = async (req, res, next) => {
  try {
    let {name, price, brandId, typeId, info} = req.body

    //забираем файл(изображение) npm i express-fileupload
    //регистрируем в index.js app.use(fileUpload({}))
    const {img} = req.files
    //создаём уникальное имя npm i uuid
    let fileName = uuidv4() + '.jpg'
    //перемещаем в папку static файл img
    img.mv(path.resolve(path.resolve(), 'static', fileName))

    const device = await Device.create({
      name,
      price,
      brandId,
      typeId,
      img: fileName,
    })

    //записуем info(массив переданный как строка из-за этого парсим) в базу deviceInfo
    if (info) {
      info = JSON.parse(info)
      info.forEach(i => {
        DeviceInfo.create({
          title: i.title,
          description: i.description,
          deviceId: device.id,
        })
      })
    }

    return res.json(device)
  } catch (e) {
    next(ApiError.badRequest(e.message))
  }
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getAll = async (req, res) => {
  let {brandId, typeId, limit, page} = req.query
  let devices //массив с отфильтрованым товаром

  //ограничение в показе товара на странице
  page = page || 1 //номер страницы
  limit = limit || 9 //количество товара на странице
  let offset = page * limit - limit //начиная с какого элемента показывать

  if (!brandId && !typeId) {
    //findandCountAll возвращает не массив а объект с count и массив row
    //count общее количество товара, row - массив товара
    devices = await Device.findAndCountAll({limit, offset})
  }
  if (brandId && !typeId) {
    devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
  }
  if (!brandId && typeId) {
    devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
  }
  if (brandId && typeId) {
    devices = await Device.findAndCountAll({
      where: {brandId, typeId},
      limit,
      offset,
    })
  }

  return res.json(devices)
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getOne = async (req, res) => {
  const {id} = req.params
  const device = await Device.findOne({
    where: {id},
    //и вытягиваем характеристики из DeviceInfo в массив info
    // в model должен быть прописан синоним 'info' в Devise.hasMany
    //так можно подтягивать данные с других баз подвязанных к этой
    include: [{model: DeviceInfo, as: 'info'}],
  })
  return res.json(device)
}
