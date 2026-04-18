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
    operator: { type: String, required: false, default: 'Desconocido' },
    paymentMethod: { type: String, required: false, default: 'No especificado' },
    payments: {
      type: [
        {
          method: { type: String },
          amount: { type: Number },
        },
      ],
      default: [],
    },
    givenAmount: { type: Number, required: false },
    change: { type: Number, required: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Sale', SaleSchema);
