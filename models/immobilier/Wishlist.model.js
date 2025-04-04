const { DataTypes } = require("sequelize");
const db = require("../../config/db");
const User = require("../user/User.model");
const Property = require("./Property.model");

const Wishlist = db.define(
  "Wishlist",
  {
    is_deleted: {
      // Nouveau champ ajouté
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

module.exports = Wishlist;
