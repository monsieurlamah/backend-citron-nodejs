const { DataTypes } = require("sequelize");
const db = require("../../config/db");
const User = require("../user/User.model");
const Property = require("./Property.model");

const Wishlist = db.define(
  "Wishlist",
  {
    utilisateur_id: {
      type: DataTypes.UUID,
      references: { model: User, key: "id" },
    },
    property_id: {
      type: DataTypes.UUID,
      references: { model: Property, key: "id" },
    },
  },
  { timestamps: true }
);

module.exports = Wishlist;
