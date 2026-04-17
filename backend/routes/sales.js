const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

// GET /api/sales (Ver histórico)
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor al obtener historial' });
  }
});

// POST /api/sales (Siguiente compra)
router.post('/', async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No se enviaron productos para facturar' });
    }

    const newSale = new Sale({ items, total });
    await newSale.save();

    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor al guardar la venta' });
  }
});

module.exports = router;
