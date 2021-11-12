import express from 'express'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import path from 'path'
import cors from 'cors'

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
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
//чтобы работал req.files для передачи файлов
app.use(fileUpload({}))
app.use('/api', router)

//статическая раздача файлов
//ищит файлы по названию по порядку use express.static
//для nginx делаем /image чтобы в настройках прописать раздачу стаики
// а в react добавляем в путь эту приставку
app.use('/image', express.static(path.resolve(path.resolve(), './static')))
//статическая раздача frontend(для nginx не надо, там идёт проксирование)
app.use(express.static(path.resolve(path.resolve(), '../client/build')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(path.resolve(), '../client/build/index.html'))
})

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
