import dotenv from 'dotenv'

dotenv.config()

export class Configuration {
  basePath: string = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080/api/v1'
}
