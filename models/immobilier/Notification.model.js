const { DataTypes } = require("sequelize");
const db = require("../../config/db");

const Notification = db.define(
  "Notification",
  {
    status: {
      type: DataTypes.ENUM("non_lu", "lu"),
      defaultValue: "non_lu",
    },
    type_notification: {
      type: DataTypes.ENUM("reservation", "paiement", "alerte"),
    },
    message: { type: DataTypes.TEXT },
    is_deleted: {
      // Nouveau champ ajouté
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

module.exports = Notification;
