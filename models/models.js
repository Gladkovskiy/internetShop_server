import onlineStore from '../db.js'
import sequelize from 'sequelize'

const DataType = sequelize.DataTypes

//описание таблиц, поля и их типы, хар-ки и тд.
//Внешнии зависимости не прописуются!!!
export const User = onlineStore.define('user', {
  id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataType.STRING, unique: true},
  password: {type: DataType.STRING},
  role: {type: DataType.STRING, defaultValue: 'USER'},
})

export const Basket = onlineStore.define('basket', {
  id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
})

export const BasketDevice = onlineStore.define('basket_device', {
  id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
})

export const Device = onlineStore.define('device', {
  id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataType.STRING, unique: true, allowNull: false},
  price: {type: DataType.INTEGER, allowNull: false},
  rating: {type: DataType.INTEGER, defaultValue: 0},
  img: {type: DataType.STRING, allowNull: false},
})

export const Type = onlineStore.define('type', {
  id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataType.STRING, unique: true, allowNull: false},
})

export const Brand = onlineStore.define('brand', {
  id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataType.STRING, unique: true, allowNull: false},
})

export const Rating = onlineStore.define('rating', {
  id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
  rate: {type: DataType.INTEGER, allowNull: false},
})

export const DeviceInfo = onlineStore.define('device_info', {
  id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataType.STRING, allowNull: false},
  description: {type: DataType.STRING, allowNull: false},
})

//Прописуем внешнии зависимости
//один у одному и один ко многим
User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(DeviceInfo, {as: 'info'})
DeviceInfo.belongsTo(Device)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

//многие ко многим
//создаём связующую таблицу
export const typeBrand = onlineStore.define('type_brand', {
  id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
})
Type.belongsToMany(Brand, {through: typeBrand})
Brand.belongsToMany(Type, {through: typeBrand})
