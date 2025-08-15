import express from "express";
import Carro from "../models/carro.js";
const router = express.Router();

router.post("/carro", async (req, res) => {
  try {
    const { marca, modelo, anio, disponible, imagenUrl, precio } = req.body;

    const disponibleBoolean = (disponible === "true" || disponible === true);

    if (!marca || !modelo || !anio || typeof disponibleBoolean !== 'boolean' || !imagenUrl) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const newCarro = new Carro({
      marca,
      modelo,
      anio,
      disponible: disponibleBoolean,
      imagenUrl,
      precio: precio || 50000, // Precio por defecto
    });

    const carro = await newCarro.save();
    res.status(201).json(carro);
    console.log("carro creado:", carro);
  } catch (e) {
    console.error("Error en la ruta /carro", e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/carros", async (req, res) => {
  try {
    const carros = await Carro.find();
    res.status(200).json(carros);
  } catch (e) {
    console.error("Error al obtener los carros", e);
    res.status(500).json({ error: e.message });
  }
});


router.get("/carro/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const carro = await Carro.findById(id);
    if (!carro) {
      return res.status(404).json({ error: "carro no encontrado" });
    }
    res.status(200).json(carro);
  } catch (e) {
    console.error("Error al obtener el carro", e);
    res.status(500).json({ error: e.message });
  }
});

router.put("/carro/:id", async (req, res) => {
  const { id } = req.params;
  const { marca, modelo, anio, disponible, imagenUrl, precio } = req.body;
  console.log("Actualizando carro con ID:", id);
  Carro.updateOne({ _id: id }, { $set: { marca, modelo, anio, disponible, imagenUrl, precio } })
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error("Error al actualizar el carro", err);
      res.status(500).json({ error: err.message });
    });
});
export default router;
