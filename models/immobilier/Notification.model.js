const { DataTypes } = require("sequelize");
const db = require("../../config/db");

const Review = db.define(
  "Review",
  {
    status: {
        type: DataTypes.ENUM("non_lu", "lu"),
        defaultValue: "non_lu",
      },    
      type_notification: { 
        type: DataTypes.ENUM("reservation", "paiement", "alerte") },
    message: { type: DataTypes.TEXT },
  },
  { timestamps: true }
);

module.exports = Review;
