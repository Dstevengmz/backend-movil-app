import mongoose from "mongoose";

const carroSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: true,
  },
  modelo: {
    type: String,
    required: true,
  },
  anio: {
    type: Number,
    required: true,
  },
  disponible: {
    type: Boolean,
    required: true,
  },
  imagenUrl: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
    default: 25000,
  },
});

const Carro = mongoose.model("Carro", carroSchema);
export default Carro;
