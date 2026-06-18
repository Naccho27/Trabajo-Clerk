import dotenv from "dotenv";
console.log(
  "GEMINI:",
  process.env.GEMINI_API_KEY
);
dotenv.config();

import app from "./app.js";

import connectDB from "./config/db.js";

const PORT = process.env.PORT || 3000;

connectDB();



app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${PORT} 🚀`
  );
});