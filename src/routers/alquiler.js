import express from "express";
import Alquiler from "../models/alquiler.js";
import Carro from "../models/carro.js";
import User from "../models/user.js";

const router = express.Router();

router.post("/alquiler", async (req, res) => {
  try {
    const { usuarioId, carroId, fechaInicio, fechaFin, precioTotal } = req.body;

    if (!usuarioId || !carroId || !fechaInicio || !fechaFin || !precioTotal) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const carro = await Carro.findById(carroId);
    if (!carro) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    if (!carro.disponible) {
      return res.status(400).json({ error: "El vehículo no está disponible" });
    }

    const nuevoAlquiler = new Alquiler({
      usuario: usuarioId,
      carro: carroId,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
      precioTotal,
    });

    const alquiler = await nuevoAlquiler.save();

    await Carro.updateOne({ _id: carroId }, { $set: { disponible: false } });

    const alquilerCompleto = await Alquiler.findById(alquiler._id)
      .populate("usuario", "name email")
      .populate("carro", "marca modelo anio imagenUrl");

    res.status(201).json({
      message: "Alquiler creado exitosamente",
      alquiler: alquilerCompleto,
    });

    console.log("Alquiler creado:", alquilerCompleto);
  } catch (e) {
    console.error("Error en la ruta /alquiler", e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/alquileres", async (req, res) => {
  try {
    const alquileres = await Alquiler.find()
      .populate("usuario", "name email")
      .populate("carro", "marca modelo anio imagenUrl");
    res.status(200).json(alquileres);
  } catch (e) {
    console.error("Error al obtener los alquileres", e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/alquileres/usuario/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const alquileres = await Alquiler.find({ usuario: usuarioId })
      .populate("usuario", "name email")
      .populate("carro", "marca modelo anio imagenUrl");
    res.status(200).json(alquileres);
  } catch (e) {
    console.error("Error al obtener los alquileres del usuario", e);
    res.status(500).json({ error: e.message });
  }
});

router.put("/alquiler/:id/finalizar", async (req, res) => {
  try {
    const { id } = req.params;

    const alquiler = await Alquiler.findById(id);
    if (!alquiler) {
      return res.status(404).json({ error: "Alquiler no encontrado" });
    }
    await Alquiler.updateOne({ _id: id }, { $set: { estado: "finalizado" } });
    await Carro.updateOne(
      { _id: alquiler.carro },
      { $set: { disponible: true } }
    );

    res.status(200).json({ message: "Alquiler finalizado exitosamente" });
  } catch (e) {
    console.error("Error al finalizar el alquiler", e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/alquiler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const alquiler = await Alquiler.findById(id)
      .populate("usuario", "name email")
      .populate("carro", "marca modelo anio imagenUrl");

    if (!alquiler) {
      return res.status(404).json({ error: "Alquiler no encontrado" });
    }
    res.status(200).json(alquiler);
  } catch (e) {
    console.error("Error al obtener el alquiler", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
