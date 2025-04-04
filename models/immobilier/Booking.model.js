const { DataTypes } = require("sequelize");
const db = require("../../config/db");

const Booking = db.define("Booking", {
  statut: {
    type: DataTypes.ENUM("en_attente", "confirmer", "annuler", "terminer"),
    defaultValue: "en_attente",
  },
  date_debut: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  date_fin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  montant_total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  is_deleted: {  // Nouveau champ ajouté
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = Booking;
