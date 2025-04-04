const { DataTypes } = require("sequelize");
const db = require("../../config/db");

const Appointment = db.define(
  "Appointment",
  {
    appointmentDate: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM("en_attente", "confirmer", "annuler"),
      defaultValue: "en_attente",
    },
    is_deleted: {  // Nouveau champ ajouté
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

module.exports = Appointment;
