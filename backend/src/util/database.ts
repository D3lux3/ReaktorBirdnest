import { Sequelize } from 'sequelize'
import { DATABASE_URL } from './config'

export const sequelize = new Sequelize(DATABASE_URL, { logging: false, dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } });

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('database connected')
  } catch (err) {
    console.log('connecting database failed')
    process.exit(1)
  }
}
