const isDevelopment = process.env.NODE_ENV !== "production";

export const API_URL = isDevelopment ? "http://localhost:3000" : "http://3.18.65.138:3000";