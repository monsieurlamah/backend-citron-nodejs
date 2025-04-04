const { DataTypes } = require("sequelize");
const db = require("../../config/db");

// Définir le modèle (table user) avec Sequelize
const User = db.define(
  "User",
  {
    prenom: {
      type: DataTypes.STRING,
      allowNull: false, // Champ requis
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false, // Champ requis
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: "picture",
      allowNull: false, // Champ requis
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Champ requis
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Champ requis
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false, // Champ requis
      defaultValue: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false, // Champ requis
      defaultValue: false,
    },
    role: { // Correction ici
      type: DataTypes.STRING,
      allowNull: false, // Champ requis
      defaultValue: "user",
      validate: {
        isIn: [["user", "proprietaire", "locataire", "admin", "superAdmin"]],
      },
    },
    is_deleted: {
      // Nouveau champ ajouté
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Correction ici
    underscored: true, // Utilisation de snake_case
  }
);

module.exports = User;
