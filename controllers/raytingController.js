import express from 'express'

import {Rating} from '../models/models.js'
import ApiError from '../error/ApiError.js'

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const create = async (req, res, next) => {
  try {
    const {userId, deviceId, rate} = req.body
    const rating = await Rating.create({userId, deviceId, rate})
    res.json(rating)
  } catch (error) {
    next(ApiError.internal(error.message))
  }
}
