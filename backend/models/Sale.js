const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema(
  {
    items: [
      {
        barcode: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Sale', SaleSchema);
