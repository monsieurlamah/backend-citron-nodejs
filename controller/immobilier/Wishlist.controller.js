const { Wishlist, Property } = require("../../models/relations");
const createError = require("../../middlewares/error");

// ✅ 1. Ajouter une propriété aux favoris
exports.addToWishlist = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour ajouter un favori."));
        }

        const { property_id } = req.body;

        // Vérifier si la propriété existe
        const property = await Property.findByPk(property_id);
        if (!property) {
            return next(createError(404, "Propriété non trouvée !"));
        }

        // Vérifier si la propriété est déjà en favoris
        const existingWishlist = await Wishlist.findOne({
            where: { utilisateur_id: req.user.id, property_id, is_deleted: false },
        });

        if (existingWishlist) {
            return res.status(200).json({
                message: "Cette propriété est déjà dans votre liste de favoris.",
                wishlist: existingWishlist,
            });
        }

        const wishlist = await Wishlist.create({
            utilisateur_id: req.user.id,
            property_id,
        });

        return res.status(201).json({
            message: "Propriété ajoutée aux favoris avec succès !",
            wishlist,
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout aux favoris :", error);
        return next(createError(500, "Erreur serveur lors de l'ajout aux favoris."));
    }
};

// ✅ 2. Récupérer les favoris actifs
exports.getActiveWishlist = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.findAll({
            where: { is_deleted: false },
            include: [{ model: Property }],
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({ wishlist });
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
        return next(createError(500, "Erreur serveur lors de la récupération des favoris."));
    }
};

// ✅ 3. Récupérer les favoris d’un utilisateur
exports.getUserWishlist = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour voir vos favoris."));
        }

        const wishlist = await Wishlist.findAll({
            where: { utilisateur_id: req.user.id, is_deleted: false },
            include: [{ model: Property }],
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({ wishlist });
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris utilisateur :", error);
        return next(createError(500, "Erreur serveur lors de la récupération des favoris utilisateur."));
    }
};

// ✅ 4. Supprimer un favori (Soft delete)
exports.deleteWishlistItem = async (req, res, next) => {
    try {
        const wishlistItem = await Wishlist.findByPk(req.params.id);

        if (!wishlistItem) {
            return next(createError(404, "Favori non trouvé !"));
        }

        if (wishlistItem.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez supprimer que vos propres favoris."));
        }

        await wishlistItem.update({ is_deleted: true });

        return res.status(200).json({
            message: "Favori supprimé avec succès !",
        });
    } catch (error) {
        console.error("Erreur lors de la suppression du favori :", error);
        return next(createError(500, "Erreur serveur lors de la suppression du favori."));
    }
};
