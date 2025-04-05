const { Intermediation } = require("../../models/relations");
const createError = require("../../middlewares/error");

// ✅ Créer une demande d’intermédiation
exports.postIntermediation = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour faire une demande."));
        }

        const intermediation = await Intermediation.create({
            ...req.body,
            utilisateur_id: req.user.id,
        });

        return res.status(201).json({
            message: "Demande d'intermédiation envoyée avec succès.",
            intermediation
        });
    } catch (error) {
        console.error("Erreur création intermédiation :", error);
        return next(createError(500, "Erreur serveur lors de la création de la demande"));
    }
};

// ✅ Modifier une demande
exports.updateIntermediation = async (req, res, next) => {
    try {
        const intermediation = await Intermediation.findOne({
            where: { id: req.params.id, is_deleted: false }
        });

        if (!intermediation) {
            return next(createError(404, "Demande non trouvée !"));
        }

        if (intermediation.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez modifier que vos propres demandes."));
        }

        await intermediation.update(req.body);

        return res.status(200).json({
            message: "Demande mise à jour avec succès.",
            intermediation
        });
    } catch (error) {
        console.error("Erreur update intermédiation :", error);
        return next(createError(500, "Erreur serveur lors de la mise à jour"));
    }
};

// ✅ Supprimer une demande (soft delete)
exports.deleteIntermediation = async (req, res, next) => {
    try {
        const intermediation = await Intermediation.findByPk(req.params.id);

        if (!intermediation) {
            return next(createError(404, "Demande non trouvée !"));
        }

        if (intermediation.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez supprimer que vos propres demandes."));
        }

        await intermediation.update({ is_deleted: true });

        return res.status(200).json({ message: "Demande supprimée avec succès." });
    } catch (error) {
        console.error("Erreur suppression intermédiation :", error);
        return next(createError(500, "Erreur serveur lors de la suppression"));
    }
};

// ✅ Récupérer les demandes de l'utilisateur connecté
exports.getUserIntermediations = async (req, res, next) => {
    try {
        const demandes = await Intermediation.findAll({
            where: {
                utilisateur_id: req.user.id,
                is_deleted: false
            },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            message: "Vos demandes d'intermédiation ont été récupérées.",
            demandes
        });
    } catch (error) {
        console.error("Erreur récupération des demandes :", error);
        return next(createError(500, "Erreur lors de la récupération"));
    }
};

// ✅ Récupérer toutes les demandes (admin uniquement)
exports.getAllIntermediations = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return next(createError(403, "Accès refusé ! Seuls les administrateurs peuvent voir toutes les demandes."));
        }

        const demandes = await Intermediation.findAll({
            where: { is_deleted: false },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            message: "Toutes les demandes ont été récupérées.",
            demandes
        });
    } catch (error) {
        console.error("Erreur récupération toutes les demandes :", error);
        return next(createError(500, "Erreur serveur lors de la récupération"));
    }
};
