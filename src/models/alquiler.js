import mongoose from "mongoose";

const alquilerSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carro",
    required: true,
  },
  fechaInicio: {
    type: Date,
    required: true,
  },
  fechaFin: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ["activo", "finalizado", "cancelado"],
    default: "activo",
  },
  precioTotal: {
    type: Number,
    required: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

const Alquiler = mongoose.model("Alquiler", alquilerSchema);
export default Alquiler;
