const { Review } = require("../../models/relations");
const createError = require("../../middlewares/error");

// ✅ Ajouter un avis
exports.postReview = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour donner un avis."));
        }

        const { commentaire, note, property_id } = req.body;

        if (!commentaire || !note || !property_id) {
            return next(createError(400, "Tous les champs sont requis (commentaire, note, propriété)."));
        }

        // Création de l'avis
        const newReview = await Review.create({
            commentaire,
            note,
            property_id,
            utilisateur_id: req.user.id, // Associer l'avis à l'utilisateur connecté
        });

        return res.status(201).json({ 
            message: "Avis ajouté avec succès !", 
            review: newReview,
        });
    } catch (error) {
        console.error("Erreur lors de la création de l'avis :", error);
        return next(createError(500, "Erreur serveur lors de la création de l'avis"));
    }
};

// ✅ Récupérer tous les avis visibles
exports.getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: { is_deleted: false }, // Exclure les avis supprimés
            order: [["createdAt", "DESC"]], // Trier du plus récent au plus ancien
        });

        return res.status(200).json({
            message: "Liste de tous les avis récupérée avec succès !",
            reviews,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        return next(createError(500, "Erreur serveur lors de la récupération des avis"));
    }
};


// ✅ Récupérer les avis de l'utilisateur connecté
exports.getUserReviews = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour voir vos avis."));
        }

        const reviews = await Review.findAll({
            where: { 
                utilisateur_id: req.user.id, 
                is_deleted: false 
            },
            order: [["createdAt", "DESC"]] // Tri par date de création (du plus récent au plus ancien)
        });

        return res.status(200).json({
            message: "Liste de vos avis récupérée avec succès !",
            reviews,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        return next(createError(500, "Erreur serveur lors de la récupération de vos avis"));
    }
};

// ✅ Mettre à jour un avis
exports.updateReview = async (req, res, next) => {
    try {
        const review = await Review.findOne({
            where: { id: req.params.id, is_deleted: false },
        });

        if (!review) {
            return next(createError(404, "Avis non trouvé !"));
        }

        if (review.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez modifier que vos propres avis."));
        }

        // Mise à jour sécurisée (empêche la modification de l'utilisateur)
        await review.update({ 
            commentaire: req.body.commentaire || review.commentaire, 
            note: req.body.note || review.note 
        });

        return res.status(200).json({
            message: "Avis mis à jour avec succès !",
            review,
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'avis :", error);
        return next(createError(500, "Erreur serveur lors de la mise à jour de l'avis"));
    }
};

// ✅ Supprimer un avis (soft delete)
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findOne({
            where: { id: req.params.id, is_deleted: false },
        });

        if (!review) {
            return next(createError(404, "Avis non trouvé !"));
        }

        if (review.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez supprimer que vos propres avis."));
        }

        await review.update({ is_deleted: true });

        return res.status(200).json({
            message: "Avis supprimé avec succès !"
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'avis :", error);
        return next(createError(500, "Erreur serveur lors de la suppression de l'avis"));
    }
};
