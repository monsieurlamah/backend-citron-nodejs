const { Category, Property } = require("../../models/relations/");
const createError = require("../../middlewares/error");
const { Op } = require("sequelize");
const slugify = require("slugify");

// Créer une propriété avec validation
exports.createCategory = async (req, res, next) => {
  try {
    const { title, image } = req.body;
    if (!title || !image) {
      return next(
        createError(400, "Tous les champs obligatoires doivent être remplis.")
      );
    }

    // Générer un slug unique avec un identifiant aléatoire
    const randomValue = Math.floor(1000 + Math.random() * 9000); // Génère un nombre entre 1000 et 9999
    req.body.slug = slugify(`${title}-${randomValue}`, {
      lower: true,
      strict: true,
    });
    req.body.is_deleted = false;

    const existingCategory = await Category.findOne({
      where: { slug: req.body.slug },
    });
    if (existingCategory) {
      return next(createError(409, "Une catégorie avec ce nom existe déjà."));
    }

    const newCategory = await Category.create(req.body);
    res
      .status(201)
      .json({ message: "Catégorie ajoutée avec succès !", newCategory });
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la création de la catégorie",
        error.message
      )
    );
  }
};

// Récupérer toutes les propriétés actives avec pagination et recherche
exports.getAllCategories = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { is_deleted: false };
    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    const categories = await Category.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: categories.count,
      totalPages: Math.ceil(categories.count / limit),
      data: categories.rows,
    });
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la récupération des catégories",
        error.message
      )
    );
  }
};

// Mettre à jour une propriété
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, is_deleted: false },
    });
    if (!category) {
      return next(createError(404, "Catégorie non trouvée"));
    }

    if (req.body.title) {
      const title = req.body.title;
      const randomValue = Math.floor(1000 + Math.random() * 9000); // Génère un nombre entre 1000 et 9999
      req.body.slug = slugify(`${title}-${randomValue}`, {
        lower: true,
        strict: true,
      });
    }

    await category.update(req.body);
    res.status(200).json({
      message: "Catégorie mis à jour avec succès !",
      category,
    });
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la mise à jour de la catégorie",
        error.message
      )
    );
  }
};

// Supprimer une propriété (soft delete)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, is_deleted: false },
    });
    if (!category) {
      return next(createError(404, "Catégorie non trouvée"));
    }

    await category.update({ is_deleted: true });
    res.status(200).json({ message: "Catégorie supprimée avec succès." });
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la suppression de la catégorie",
        error.message
      )
    );
  }
};

exports.categoryWithProperties = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: {
        model: Property,
        as: "property",
      },
    });
    if (!category) return next(createError(404, "Catégorie non trouvée !"));
    return res.status(200).json(category);
  } catch (error) {
    next(
      createError(
        500,
        "Erreur lors de la récupération de la catégorie avec les propriétés",
        error.message
      )
    );
  }
};
