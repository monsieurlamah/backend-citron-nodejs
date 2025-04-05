const { Booking } = require("../../models/relations");
const createError = require("../../middlewares/error");

// ✅ Prendre un rendez-vous
exports.postBooking = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour faire une réservation."));
        }

        const booking = await Booking.create({
            ...req.body,
            utilisateur_id: req.user.id, // Associer la réservation à l'utilisateur connecté
        });

        return res.status(201).json({ 
            message: "Réservation effectuée avec succès !", 
            booking 
        });
    } catch (error) {
        console.error("Erreur lors de la réservation :", error);
        return next(createError(500, "Erreur serveur lors de la réservation"));
    }
};

// ✅ Mettre à jour un rendez-vous
exports.updateBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({
            where: { id: req.params.id, is_deleted: false }
        });

        if (!booking) {
            return next(createError(404, "Réservation non trouvée !"));
        }

        if (booking.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez modifier que vos propres réservations."));
        }

        await booking.update(req.body);

        return res.status(200).json({
            message: "Réservation mise à jour avec succès !",
            booking
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la réservation :", error);
        return next(createError(500, "Erreur serveur lors de la mise à jour de la réservation"));
    }
};

// ✅ Supprimer un rendez-vous (Soft Delete)
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return next(createError(404, "Réservation non trouvée !"));
        }

        if (booking.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez supprimer que vos propres réservations."));
        }

        await booking.update({ is_deleted: true });

        return res.status(200).json({
            message: "Réservation supprimée avec succès !"
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de la réservation :", error);
        return next(createError(500, "Erreur serveur lors de la suppression de la réservation"));
    }
};

// ✅ Récupérer les réservations d'un utilisateur spécifique
exports.getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            where: { utilisateur_id: req.user.id, is_deleted: false },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            message: "Réservations récupérées avec succès !",
            bookings
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        return next(createError(500, "Erreur serveur lors de la récupération des réservations"));
    }
};

// ✅ Récupérer toutes les réservations (admin uniquement)
exports.getAllBookings = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return next(createError(403, "Accès refusé ! Seuls les administrateurs peuvent voir toutes les réservations."));
        }

        const bookings = await Booking.findAll({
            where: { is_deleted: false },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            message: "Toutes les réservations récupérées avec succès !",
            bookings
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de toutes les réservations :", error);
        return next(createError(500, "Erreur serveur lors de la récupération de toutes les réservations"));
    }
};
