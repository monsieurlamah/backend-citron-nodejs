const { DataTypes } = require("sequelize");
const db = require("../../config/db");

const Intermediation = db.define(
  "Intermediation",
  {
    type: { type: DataTypes.ENUM("achat", "construction") },
    details: { type: DataTypes.JSON },
    status: {
      type: DataTypes.ENUM("en_attente", "traiter", "refuser"),
      defaultValue: "en_attente",
    },
  },
  { timestamps: true }
);

module.exports = Intermediation;
