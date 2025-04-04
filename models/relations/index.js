const db = require("../../config/db");


// Importer les modèles avec les chemins corrects

// Immobilier
const Property = require("../immobilier/Property.model");
const Category = require("../immobilier/Category.model");
const Booking = require("../immobilier/Booking.model");
const Payment = require("../immobilier/Payment.model");
const Review = require("../immobilier/Review.model");
const Intermediation = require("../immobilier/Intermediation.model");
const Notification = require("../immobilier/Notification.model");
const Appointment = require("../immobilier/Appointment.model");
const User = require("../user/User.model");
const Wishlist = require("../immobilier/Wishlist.model");

// Définir les relations entre les modèles (tables)

// Une catégorie peut avoir plusieurs propriétés
Category.hasMany(Property, { foreignKey: "category_id" });
Property.belongsTo(Category, { foreignKey: "category_id" });

// Une propriété peut avoir plusieurs réservations
Property.hasMany(Booking, { foreignKey: "property_id" });
Booking.belongsTo(Property, { foreignKey: "property_id" });

// Un utilisateur peut posséder plusieurs propriétés
User.hasMany(Property, { foreignKey: "proprietaire_id" });
Property.belongsTo(User, { foreignKey: "proprietaire_id" });

// Un utilisateur peut effectuer plusieurs réservations
User.hasMany(Booking, { foreignKey: "utilisateur_id" });
Booking.belongsTo(User, { foreignKey: "utilisateur_id" });

// Une réservation peut avoir un paiement
Booking.hasOne(Payment, { foreignKey: "reservation_id", onDelete: "CASCADE" });
Payment.belongsTo(Booking, { foreignKey: "reservation_id" });

// Un utilisateur peut effectuer plusieurs paiements
User.hasMany(Payment, { foreignKey: "utilisateur_id" });
Payment.belongsTo(User, { foreignKey: "utilisateur_id" });

// Une propriété peut recevoir plusieurs avis
Property.hasMany(Review, { foreignKey: "property_id", onDelete: "CASCADE" });
Review.belongsTo(Property, { foreignKey: "property_id" });

// Un utilisateur peut laisser plusieurs avis
User.hasMany(Review, { foreignKey: "utilisateur_id" });
Review.belongsTo(User, { foreignKey: "utilisateur_id" });

// Un utilisateur peut recevoir plusieurs notification
User.hasMany(Notification, { foreignKey: "utilisateur_id", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "utilisateur_id" });

// Un utilisateur peut faire plusieurs demandes d'intermédiation
User.hasMany(Intermediation, { foreignKey: "utilisateur_id", onDelete: "CASCADE" });
Intermediation.belongsTo(User, { foreignKey: "utilisateur_id" });

// Une propriété peut avoir plusieurs rendez-vous
Property.hasMany(Appointment, { foreignKey: "property_id", onDelete: "CASCADE" });
Appointment.belongsTo(Property, { foreignKey: "property_id" });

// Un utilisateur peut demander plusieurs rendez-vous
User.hasMany(Appointment, { foreignKey: "utilisateur_id" });
Appointment.belongsTo(User, { foreignKey: "utilisateur_id" });

// Un utilisateur peut demander plusieurs favoris
User.hasMany(Wishlist, {foreignKey: "utilisateur_id"});
Wishlist.belongsTo(User, { foreignKey: "utilisateur_id" });

// Une propriété peut recevoir plusieurs favoris
Property.hasMany(Wishlist, { foreignKey: "property_id", onDelete: "CASCADE" });
Wishlist.belongsTo(Property, { foreignKey: "property_id" });


// Exporter tous les modèles
module.exports = {
  db,
  Property,
  Category,
  User,
  Booking,
  Payment,
  Review,
  Intermediation,
  Notification,
  Appointment,
  Wishlist,
};
