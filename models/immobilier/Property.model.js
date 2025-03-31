const { DataTypes } = require("sequelize");
const db = require("../../config/db");

const Property = db.define(
  "Property",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    intro: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surface: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("appartement", "maison", "villa", "bureau", "hotel", "terrain"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("disponible", "vendu", "a_louer", "reserver", "a_vendre"),
      allowNull: true,
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Ajoute 'createdAt' et 'updatedAt'
    underscored: true, // Utilisation du snake_case pour les colonnes
  }
);

module.exports = Property;