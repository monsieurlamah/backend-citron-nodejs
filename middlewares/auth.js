const jwt = require("jsonwebtoken");
const ENV = require("../config");
const createError = require("./error");

const verifyToken = (req, res, next) => {
    try {

        // Récupère le jeton à partir des cookies de la requête
        const token = req.cookies.access_token;

        // Renvoie une erreur 401 (accès refusé)
        if (!token) {
            return next(createError(401, "Accès refusé ! Aucun token fourni."));
        }

        jwt.verify(token, ENV.TOKEN_SECRET, (err, user) => {
            // Renvoie une erreur 403 (interdit)
            // Car le jeton (token) n'est pas valide
            if (err) {
                console.error("Erreur de vérification du token :", err.message);
                return next(createError(403, "Token invalide ou expiré !", err.message));
            }

            req.user = user; // Attache l'utilisateur à l'objet `req`
            next();
        });
    } catch (error) {
        console.error("Erreur dans le middleware d'authentification :", error);
        return next(createError(500, "Erreur interne du serveur"));
    }
};

module.exports = verifyToken;
