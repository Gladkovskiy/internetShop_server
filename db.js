import sequelize from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const onlineStore = new sequelize.Sequelize(
  process.env.DB_NAME, //имя БД
  process.env.DB_USER, //юзер под которым подключаемся
  process.env.DB_PASSWORD, //пароль
  {
    dialect: 'postgres', //тип БД
    host: process.env.DB_HOST, //host
    port: process.env.DB_PORT, //порт
  }
)

export default onlineStore
