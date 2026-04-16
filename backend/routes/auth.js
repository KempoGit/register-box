const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ correo: email });
    if (!user) {
      return res.status(404).json({ error: 'Correo no encontrado.' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });

    const resetLink = `http://localhost:4200/reset-password/${token}`;
    console.log(`\n\n========================================`);
    console.log(`✉️ SIMULADOR DE EMAIL`);
    console.log(`Para: ${email}`);
    console.log(`Asunto: Recuperación de tu contraseña`);
    console.log(`Haz clic en este enlace para crear una nueva contraseña:`);
    console.log(resetLink);
    console.log(`========================================\n\n`);

    res.status(200).json({
      message: 'Correo de recuperación enviado exitosamente. Revisa la terminal backend.',
    });
  } catch (error) {
    console.error('Error in /forgot-password:', error);
    res.status(500).json({ error: 'Error del servidor al solicitar recuperación.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'El enlace de recuperación es inválido o ha expirado.' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.contrasena = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error in /reset-password:', error);
    res.status(500).json({ error: 'Error del servidor al restablecer contraseña.' });
  }
});

module.exports = router;
