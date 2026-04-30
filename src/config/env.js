import dotenv from "dotenv"; 
dotenv.config();
export default {
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  port: process.env.PORT || 3000,
};