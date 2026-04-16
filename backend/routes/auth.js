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

    console.log('Usuario registrado exitosamente:', newUser);

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).json({ error: 'Error del servidor al registrar el usuario.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ correo: email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.contrasena);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    res
      .status(200)
      .json({ message: 'Login exitoso.', user: { nombre: user.nombre, correo: user.correo } });
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ error: 'Error del servidor al iniciar sesión.' });
  }
});

module.exports = router;
