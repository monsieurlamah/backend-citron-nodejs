const { DataTypes } = require("sequelize");
const db = require("../../config/db");

const Payment = db.define(
  "Payment",
  {
    amount: { type: DataTypes.FLOAT },
    method: { type: DataTypes.ENUM("carte", "PayPal", "mobile_money") },
    status: {
      type: DataTypes.ENUM("en_attente", "reussi", "echec"),
      defaultValue: "en_attente",
    },
    receipt: { type: DataTypes.STRING },
    paymentDate: { type: DataTypes.DATE },
  },
  {
    timestamps: true, // Ajoute 'createdAt' et 'updatedAt'
  }
);

module.exports = Payment;
