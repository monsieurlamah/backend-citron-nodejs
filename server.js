console.log("🚀 Démarrage du serveur...");

const express = require("express");
const ENV = require("./config");
const {db} = require("./models/relations");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();

// IMPORTATION DES ROUTES
const userRouter = require("./router/user/user.router");
const propertyRouter = require("./router/immobilier/property.router");
const ReviewRouter = require("./router/immobilier/review.router");
const CategoryRouter = require("./router/immobilier/category.router");
const AppointmentRouter = require("./router/immobilier/appointment.router");
const BookingRouter = require("./router/immobilier/booking.router");
const PaymentRouter = require("./router/immobilier/payment.router");
const IntermediationRouter = require("./router/immobilier/payment.router");

// PORT
const PORT = ENV.PORT || 8080;

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

// PREFIX
app.use("/api/v1/user", userRouter);
app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/review", ReviewRouter);
app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/appointment", AppointmentRouter);
app.use("/api/v1/booking", BookingRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/intermediation", IntermediationRouter);

// MIDDLEWARE DE GESTION D'ERREURS
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Une erreur est survenue.";
  const details = err.details || null;

  res.status(status).json({
    error: {
      status,
      message,
      details,
    },
  });
});

// SERVEUR

// User.sync({ alter: true })  // Modifie la table existante sans supprimer les données
//   .then(() => {
//     console.log("Table Wishlist mise à jour avec le champ is_deleted !");
//   })
//   .catch((err) => console.error("Erreur lors de la synchronisation :", err));

const startServer = async () => {
  try {
    await db.sync({ force: false });
    console.log("✅ Base de données synchronisée avec succès !");

    app.listen(PORT, () => {
      console.log(`🚀 serveur fonctionnant sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      `❌ Erreur lors de la synchronisation de la base de données : `,
      error.message
    );
  }
};

startServer();
