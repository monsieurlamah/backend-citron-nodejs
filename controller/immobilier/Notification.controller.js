const { Notification } = require("../../models/relations");
const createError = require("../../middlewares/error");

// ✅ Créer une notification
exports.createNotification = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour créer une notification."));
        }

        const notification = await Notification.create({
            ...req.body,
            utilisateur_id: req.user.id, // Associer la notification à l'utilisateur connecté
        });

        return res.status(201).json({
            message: "Notification créée avec succès !",
            notification,
        });
    } catch (error) {
        console.error("Erreur lors de la création de la notification :", error);
        return next(createError(500, "Erreur serveur lors de la création de la notification"));
    }
};

// ✅ Récupérer toutes les notifications de l'utilisateur connecté
exports.getUserNotifications = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour voir vos notifications."));
        }

        const notifications = await Notification.findAll({
            where: { utilisateur_id: req.user.id, is_deleted: false },
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({ notifications });
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
        return next(createError(500, "Erreur serveur lors de la récupération des notifications"));
    }
};

// ✅ Mettre à jour une notification (ex: marquer comme lue)
exports.updateNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            where: { id: req.params.id, is_deleted: false },
        });

        if (!notification) {
            return next(createError(404, "Notification non trouvée !"));
        }

        if (notification.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez modifier que vos propres notifications."));
        }

        await notification.update(req.body);

        return res.status(200).json({
            message: "Notification mise à jour avec succès !",
            notification,
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la notification :", error);
        return next(createError(500, "Erreur serveur lors de la mise à jour de la notification"));
    }
};

// ✅ Supprimer une notification (soft delete)
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return next(createError(404, "Notification non trouvée !"));
        }

        if (notification.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez supprimer que vos propres notifications."));
        }

        await notification.update({ is_deleted: true });

        return res.status(200).json({
            message: "Notification supprimée avec succès !",
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de la notification :", error);
        return next(createError(500, "Erreur serveur lors de la suppression de la notification"));
    }
};
