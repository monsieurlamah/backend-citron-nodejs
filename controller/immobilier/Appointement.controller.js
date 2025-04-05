const { Appointment } = require("../../models/relations");
const createError = require("../../middlewares/error");

// ✅ Prendre un rendez-vous
exports.postAppointment = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(createError(401, "Vous devez être connecté pour prendre un rendez-vous."));
        }

        const appointment = await Appointment.create({
            ...req.body,
            utilisateur_id: req.user.id,
        });

        return res.status(201).json({ 
            message: "Rendez-vous pris avec succès !", 
            appointment 
        });
    } catch (error) {
        console.error("Erreur lors de la prise de rendez-vous :", error);
        return next(createError(500, "Erreur serveur lors de la création du rendez-vous"));
    }
};

// ✅ Modifier un rendez-vous
exports.updateAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findOne({
            where: { id: req.params.id, is_deleted: false }
        });

        if (!appointment) {
            return next(createError(404, "Rendez-vous non trouvé !"));
        }

        if (appointment.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez modifier que vos propres rendez-vous."));
        }

        await appointment.update(req.body);

        return res.status(200).json({
            message: "Rendez-vous mis à jour avec succès !",
            appointment
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        return next(createError(500, "Erreur serveur lors de la mise à jour du rendez-vous"));
    }
};

// ✅ Supprimer (soft delete)
exports.deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return next(createError(404, "Rendez-vous non trouvé !"));
        }

        if (appointment.utilisateur_id !== req.user.id) {
            return next(createError(403, "Accès refusé ! Vous ne pouvez supprimer que vos propres rendez-vous."));
        }

        await appointment.update({ is_deleted: true });

        return res.status(200).json({
            message: "Rendez-vous supprimé avec succès !"
        });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        return next(createError(500, "Erreur serveur lors de la suppression du rendez-vous"));
    }
};

// ✅ Récupérer les rendez-vous d’un utilisateur connecté
exports.getUserAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.findAll({
            where: {
                utilisateur_id: req.user.id,
                is_deleted: false
            },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            message: "Vos rendez-vous ont été récupérés avec succès.",
            appointments
        });
    } catch (error) {
        console.error("Erreur récupération rendez-vous utilisateur :", error);
        return next(createError(500, "Erreur lors de la récupération de vos rendez-vous"));
    }
};

// ✅ Récupérer tous les rendez-vous (admin uniquement)
exports.getAllAppointments = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return next(createError(403, "Accès refusé ! Seuls les administrateurs peuvent voir tous les rendez-vous."));
        }

        const appointments = await Appointment.findAll({
            where: { is_deleted: false },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            message: "Tous les rendez-vous ont été récupérés avec succès.",
            appointments
        });
    } catch (error) {
        console.error("Erreur récupération tous les rendez-vous :", error);
        return next(createError(500, "Erreur lors de la récupération de tous les rendez-vous"));
    }
};
