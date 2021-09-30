const env = process.env.NODE_ENV
export const BASE_URL = env === "production" ? "" : "http://localhost:3000" 
