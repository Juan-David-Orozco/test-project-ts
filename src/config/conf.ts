import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 8000

export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET
export const FRONTEND_URL = process.env.FRONTEND_URL
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

export const EMAIL_SERVICE = process.env.EMAIL_SERVICE
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASS = process.env.EMAIL_PASS

export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_DB = process.env.REDIS_DB