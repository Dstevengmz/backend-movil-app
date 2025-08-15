import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userRouter from "./routers/user.js";
import carroRouter from "./routers/carro.js";
import alquilerRouter from "./routers/alquiler.js";
import cors from "cors"; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};


app.use(cors(corsOptions));

const port = process.env.PORT || 4400;
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Conectado a la base de datos MongoDB");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos MongoDB", err);
  });

app.use("/api", userRouter);
app.use("/api", carroRouter);
app.use("/api", alquilerRouter);
app.get("/", (req, res) => {
  res.send("La pagina esta corriendo");
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});

