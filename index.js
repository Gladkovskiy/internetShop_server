import express from 'express'
import dotenv from 'dotenv'
import onlineStore from './db.js'
import * as models from './models/models.js'
import router from './routes/index.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

//для распознавания json в  запросе
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/api', router)

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
