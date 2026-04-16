const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, fecha_nacimiento, correo, contrasena } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Crear y guardar el nuevo usuario
    const newUser = new User({
      nombre,
      apellido,
      fecha_nacimiento,
      correo,
      contrasena: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).json({ error: 'Error del servidor al registrar el usuario.' });
  }
});

module.exports = router;
