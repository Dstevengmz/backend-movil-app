import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(201).json(user);
    console.log("Usuario creado:", user);
  } catch (e) {
    console.error("Error en la ruta /user", e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    console.error("Error al obtener los usuarios", e);
    res.status(500).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const ispasswordValida = await bcrypt.compare(password, user.password);
    if (!ispasswordValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    console.log("Inicio de sesión exitoso:", user);
    res.status(200).json({ message: "Inicio de sesión exitoso", user });
  } catch (e) {
    console.error("Error en la ruta /login", e);
    res.status(500).json({ error: e.message });
  }
});
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (e) {
    console.error("Error al obtener el usuario", e);
    res.status(500).json({ error: e.message });
  }
});

router.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { name, email, password } = req.body;

    const updateFields = {};
    if (typeof name !== "undefined") updateFields.name = name;
    if (typeof email !== "undefined") updateFields.email = email;
    if (typeof password !== "undefined" && password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error al actualizar el usuario", err);
    return res.status(500).json({ error: err.message });
  }
});
export default router;
