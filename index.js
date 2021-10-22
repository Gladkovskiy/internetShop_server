import express from 'express'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import path from 'path'

//конфигурация подключения к БД
import onlineStore from './db.js'
//настройка таблиц в базе данных
import * as models from './models/models.js'
import router from './routes/index.js'
import errorHandler from './middleware/ErrorHandling.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

//для распознавания json в  запросе
app.use(express.json())
app.use(express.urlencoded({extended: false}))
//статическая раздача файлов
app.use(express.static(path.resolve(path.resolve(), 'static')))
//чтобы работал req.files для передачи файлов
app.use(fileUpload({}))
app.use('/api', router)

//обработчик ошибок полдений Middleware
app.use(errorHandler)

const start = async () => {
  try {
    await onlineStore.authenticate() //подключить БД
    await onlineStore.sync() //для создания схем БД
    app.listen(PORT, () => console.log(`Start on port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()
