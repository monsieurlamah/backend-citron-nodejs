const { Payment, Booking, User } = require("../../models/relations");
const createError = require("../../middlewares/error");
const { io } = require("../../server");

// ✅ 1. Créer un paiement
exports.createPayment = async (req, res, next) => {
    try {
        const { utilisateur_id, reservation_id, amount, method, receipt } = req.body;

        if (!utilisateur_id || !reservation_id || !amount || !method) {
            return next(createError(400, "Tous les champs requis doivent être remplis."));
        }

        const newPayment = await Payment.create({
            utilisateur_id,
            reservation_id,
            amount,
            method,
            status: "en_attente",
            receipt,
            paymentDate: new Date(),
        });

        // 🔔 Envoi d'une notification en temps réel
        // io.emit(`payment-${utilisateur_id}`, newPayment);

        return res.status(201).json({
            message: "Paiement enregistré avec succès.",
            payment: newPayment,
        });
    } catch (error) {
        console.error("❌ Erreur lors de la création du paiement :", error);
        return next(createError(500, "Erreur serveur lors de la création du paiement"));
    }
};

// ✅ 2. Mettre à jour le statut d’un paiement
exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            return next(createError(404, "Paiement non trouvé."));
        }

        if (!["en_attente", "reussi", "echec"].includes(status)) {
            return next(createError(400, "Statut invalide."));
        }

        payment.status = status;
        await payment.save();

        // 🔔 Notifier l’utilisateur du changement de statut en temps réel
        // io.emit(`payment-status-${payment.utilisateur_id}`, { paymentId, status });

        return res.json({
            message: "Statut du paiement mis à jour avec succès.",
            payment,
        });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du paiement :", error);
        return next(createError(500, "Erreur serveur lors de la mise à jour du paiement"));
    }
};

// ✅ 3. Récupérer les paiements d’un utilisateur
exports.getUserPayments = async (req, res, next) => {
    try {
        const { utilisateur_id } = req.params;

        const payments = await Payment.findAll({
            where: { utilisateur_id, is_deleted: false },
            include: [{ model: Booking }],
        });

        return res.json({ payments });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des paiements :", error);
        return next(createError(500, "Erreur serveur lors de la récupération des paiements"));
    }
};

// ✅ 4. Récupérer les paiements d’une réservation
exports.getBookingPayments = async (req, res, next) => {
    try {
        const { reservation_id } = req.params;

        const payments = await Payment.findAll({
            where: { reservation_id, is_deleted: false },
            include: [{ model: User }],
        });

        return res.json({ payments });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des paiements :", error);
        return next(createError(500, "Erreur serveur lors de la récupération des paiements"));
    }
};

// ✅ 5. Supprimer un paiement (soft delete)
exports.deletePayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            return next(createError(404, "Paiement non trouvé."));
        }

        payment.is_deleted = true;
        await payment.save();

        return res.json({
            message: "Paiement supprimé avec succès.",
        });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du paiement :", error);
        return next(createError(500, "Erreur serveur lors de la suppression du paiement"));
    }
};
