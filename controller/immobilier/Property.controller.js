const { Property } = require("../../models/relations/");
const createError = require("../../middlewares/error");
const { Op } = require("sequelize");
const slugify = require("slugify");

// Créer une propriété avec validation
exports.createProperty = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(
        createError(401, "Vous devez être connecté pour créer votre propriété.")
      );
    }

    const { name, images, price, location, type } = req.body;
    if (!name || !images || !price || !location || !type) {
      return next(
        createError(400, "Tous les champs obligatoires doivent être remplis.")
      );
    }

    if (
      !Array.isArray(images) ||
      images.some((img) => typeof img !== "string")
    ) {
      return next(
        createError(400, "Le champ images doit être un tableau d'URLs valides.")
      );
    }

    // Générer un slug unique avec un identifiant aléatoire
    const randomValue = Math.floor(1000 + Math.random() * 9000); // Génère un nombre entre 1000 et 9999
    req.body.slug = slugify(`${name}-${randomValue}`, {
      lower: true,
      strict: true,
    });
    req.body.is_deleted = false;

    const existingProperty = await Property.findOne({
      where: { slug: req.body.slug },
    });
    if (existingProperty) {
      return next(createError(409, "Une propriété avec ce nom existe déjà."));
    }

    const newProperty = await Property.create({
      ...req.body,
      proprietaire_id: req.user.id,
    });
    res
      .status(201)
      .json({ message: "Propriété ajouté avec succès !", newProperty });
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la création de la propriété",
        error.message
      )
    );
  }
};

// Récupérer toutes les propriétés actives avec pagination et recherche
exports.getAllProperties = async (req, res, next) => {
  try {
    const { search, type, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { is_deleted: false };
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }
    if (type) {
      whereClause.type = type;
    }
    if (status) {
      whereClause.status = status;
    }

    const properties = await Property.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: properties.count,
      totalPages: Math.ceil(properties.count / limit),
      data: properties.rows,
    });
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la récupération des propriétés",
        error.message
      )
    );
  }
};

// Récupérer une seule propriété active par son slug
exports.getPropertyBySlug = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      where: { slug: req.params.slug, is_deleted: false },
    });

    if (!property) {
      return next(createError(404, "Propriété non trouvée"));
    }

    res.status(200).json(property);
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la récupération de la propriété",
        error.message
      )
    );
  }
};

// Mettre à jour une propriété
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      where: { id: req.params.id, is_deleted: false },
    });
    if (!property) {
      return next(createError(404, "Propriété non trouvée"));
    }

    if (Property.proprietaire_id !== req.user.id) {
      return next(
        createError(
          403,
          "Accès refusé ! Vous ne pouvez modifier que vos propres propriétés."
        )
      );
    }

    if (req.body.name) {
      const name = req.body.name;
      const randomValue = Math.floor(1000 + Math.random() * 9000); // Génère un nombre entre 1000 et 9999
      req.body.slug = slugify(`${name}-${randomValue}`, {
        lower: true,
        strict: true,
      });
    }

    await property.update(req.body);
    res.status(200).json({
        message: "Avis mis à jour avec succès !",
        property
    });
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la mise à jour de la propriété",
        error.message
      )
    );
  }
};

// Supprimer une propriété (soft delete)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      where: { id: req.params.id, is_deleted: false },
    });
    if (!property) {
      return next(createError(404, "Propriété non trouvée"));
    }

    if (Property.proprietaire_id !== req.user.id) {
        return next(createError(403, "Accès refusé ! Vous ne pouvez supprimer que vos propres propriétés."));
    }

    await property.update({ is_deleted: true });
    res.status(200).json({ message: "Propriété supprimée avec succès." });
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la suppression de la propriété",
        error.message
      )
    );
  }
};

