const { DataTypes } = require("sequelize");
const db = require("../../config/db");

const Category = db.define(
  "Category",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,

    },
  },
  {
    timestamps: true, // Ajoute 'createdAt' et 'updatedAt'
  }
);

module.exports = Category;
