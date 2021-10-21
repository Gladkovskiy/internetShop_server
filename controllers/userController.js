import express from 'express'
import ApiError from '../error/ApiError.js'

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const registration = async (req, res) => {}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const login = async (req, res) => {}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const check = async (req, res, next) => {
  const {id} = req.query

  if (!id) {
    return next(ApiError.badRequest('Не задан ID'))
  }

  res.json(id)
}
