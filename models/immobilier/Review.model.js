const { DataTypes } = require("sequelize");
const db = require("../../config/db");

const Review = db.define(
  "Review",
  {
    rating: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
      alloWNull: true,
    },
    is_deleted: {  // Nouveau champ ajouté
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

module.exports = Review;
