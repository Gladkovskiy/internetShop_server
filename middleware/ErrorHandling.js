import express from 'express'
import ApiError from '../error/ApiError.js'

/**
 *
 * @param {express.ErrorRequestHandler} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
//next() не используем так как последний в списке
const error = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message})
  }
  return res.status(500).json({message: 'Unknown error'})
}

export default error
