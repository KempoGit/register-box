const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products/:barcode
router.get('/:barcode', async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor al buscar el producto' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { barcode, name, price } = req.body;

    let existing = await Product.findOne({ barcode });
    if (existing) return res.status(400).json({ error: 'Código de barras ya registrado' });

    const newProduct = new Product({ barcode, name, price });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor al crear producto' });
  }
});

module.exports = router;
