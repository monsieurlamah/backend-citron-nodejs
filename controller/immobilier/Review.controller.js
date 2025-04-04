const { Review } = require("../../models/relations");
const createError = require("../../middlewares/error");



// ✅ Ajouter un Review
exports.postReview = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour donner un avis."));
        }

        // Création de l'Review
        const Review = await Review.create({
            ...req.body,
            utilisateur_id: req.user.id, // Associer l'Review à l'utilisateur connecté
        });

        return res.status(201).json({ 
            message: "Avis ajouté avec succès !", 
            Review 
        });
    } catch (error) {
        console.error("Erreur lors de la création de l'avis :", error);
        return next(createError(500, "Erreur serveur lors de la création de l'avis"));
    }
};

// ✅ Mettre à jour un Review
exports.updateReview = async (req, res, next) => {
    try {
        const Review = await Review.findOne({
            where: {id: req.params.id, is_deleted: false}
        });
        if (!Review) {
            return next(createError(404, "Avis non trouvé !"));
        }

        if (Review.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez modifier que vos propres Avis."));
        }

        // Mise à jour sécurisée
        await Review.update(req.body);

        return res.status(200).json({
            message: "Avis mis à jour avec succès !",
            Review
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'avis :", error);
        return next(createError(500, "Erreur serveur lors de la mise à jour de l'avis"));
    }
};

// ✅ Supprimer un Review
exports.deleteReview = async (req, res, next) => {
    try {
        const Review = await Review.findByPk(req.params.id);
        if (!Review) {
            return next(createError(404, "Avis non trouvé !"));
        }

        if (Review.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez supprimer que vos propres avis."));
        }

        await Review.update({is_deleted: true});

        return res.status(200).json({
            message: "Avis supprimé avec succès !"
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'avis :", error);
        return next(createError(500, "Erreur serveur lors de la suppression de l'avis", error.message));
    }
};
