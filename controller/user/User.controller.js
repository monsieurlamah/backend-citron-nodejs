const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/relations");
const ENV = require("../../config");
const createError = require("../../middlewares/error");

// logique d'inscription
exports.signup = async (req, res, next) => {
    try {
        const { email, password, ...otherData } = req.body;

        // Vérification des entrées
        if (!email || !password) {
            return next(createError(400, "Email et mot de passe requis !"));
        }

        // Vérification de l'existence de l'email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return next(createError(409, "Cet email est déjà utilisé !"));
        }

        // Hachage du mot de passe avec un salt dynamique
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Création de l'utilisateur
        await User.create({
            email,
            password: hashedPassword,
            ...otherData,
        });

        res.status(201).json({ message: "Utilisateur inscrit avec succès !" });
    } catch (error) {
        next(createError(500, "Erreur lors de l'inscription", error.message));
    }
};

// logique de connexion
exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Vérification des entrées
        if (!email || !password) {
            return next(createError(400, "Email et mot de passe requis !"));
        }

        // Recherche de l'utilisateur
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(createError(404, "Utilisateur non trouvé !"));
        }

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(createError(401, "Identifiants incorrects !"));
        }

        // Génération du Token d'authentification
        const token = jwt.sign({ id: user.id }, ENV.TOKEN_SECRET, {
            expiresIn: "24h",
        });

        // Exclusion du mot de passe des données renvoyées
        const { password: _, ...userData } = user.dataValues;

        // Configuration des cookies de manière sécurisée
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false, // a mettre à true pour HTTPS
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 24 heures
        });

        // Réponse avec les informations de l'utilisateur
        res.status(200).json(userData);
    } catch (error) {
        next(createError(500, "Erreur lors de la connexion", error.message));
    }
};


// Récupération de tous les utilisateurs:
exports.getAllUsers = async (req, res, next) => {
    try {
        // Récupération avec sélection des champs et pagination
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const users = await User.findAll({
            attributes: { exclude: ["password"] }, // Exclure le mot de passe
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]], // Trier par date de création (du plus récent au plus ancien)
        });

        res.status(200).json({
            status: "success",
            total: users.length,
            currentPage: parseInt(page),
            users,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        next(createError(500, "Erreur lors de la récupération des utilisateurs", error.message));
    }
};

// logique de la mise à jour du profil
exports.updateProfile = async (req, res, next) => {
    try {
        const { prenom, nom, avatar, email, password } = req.body; // Champs modifiables

        // Récupération de l'utilisateur connecté
        const userId = req.user.id; // L'ID doit être extrait depuis le middleware d'authentification

        // Vérification de l'existence de l'utilisateur
        const user = await User.findByPk(userId);
        if (!user) return next(createError(404, "Utilisateur introuvable !"));

        // Mise à jour des champs fournis
        const updatedFields = {};
        if (prenom) updatedFields.prenom = prenom;
        if (nom) updatedFields.nom = nom;
        if (avatar) updatedFields.avatar = avatar;

        // Vérification de l'email unique
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) return next(createError(409, "Cet email est déjà utilisé !"));
            updatedFields.email = email;
        }

        // Hachage du mot de passe s'il est mis à jour
        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        // Mise à jour dans la base de données
        await user.update(updatedFields);
        res.status(200).json({ message: "Profil mis à jour avec succès !", user });
    } catch (error) {
        next(createError(500, "Erreur lors de la mise à jour du profil", error.message));
    }
};


exports.signout = async (req, res, next) => {
    try {
        // Vérifie si le cookie "access_token" existe
        // if (!req.cookies?.access_token) {
        //     return res.status(400).json({ message: "Aucun utilisateur connecté." });
        // }

        // Suppression du cookie
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: false, // true en production
            sameSite: "strict",
        });

        return res.status(200).json({ message: "Déconnexion réussie !" });
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
        next(createError(500, "Erreur lors de la déconnexion", error.message));
    }
};


