console.log("🚀 Démarrage du serveur...");

const express = require("express");
const ENV = require("./config");
const { db } = require("./models/relations");
const morgan = require('morgan')
const app = express();

// IMPORTATION DES ROUTES
const userRouter = require("./router/user/user.router");

// PORT
const PORT = ENV.PORT || 8080;

// MIDDLEWARE
app.use(express.json());
app.use(morgan('tiny'))

// PREFIX
app.use("/api/v1/user", userRouter);

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
