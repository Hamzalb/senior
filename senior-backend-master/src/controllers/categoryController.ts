import asyncHandler from "express-async-handler";
import Category from "../models/Category";
<<<<<<< HEAD
import Item from "../models/Product";
=======
>>>>>>> f89b985b58da9bdb50c90e231e4ddb7a2d3380be

const DEFAULT_CATEGORIES = ["Electronics", "Clothing", "Books", "Toys", "Home", "Automobiles", "Other"];

// GET /api/categories — public
export const getCategories = asyncHandler(async (req, res) => {
<<<<<<< HEAD
  // Seed if empty
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map((name) => ({ name, isDefault: true })));
  }

  // Always ensure built-in categories are marked (runs once per missing entry)
  await Category.updateMany(
    { name: { $in: DEFAULT_CATEGORIES } },
    { $set: { isDefault: true } }
  );

  // Fetch AFTER migration so isDefault is correct
  const categories = await Category.find({}).sort({ name: 1 }).lean();

  // Count products per category
  const counts = await Item.aggregate([
    { $group: { _id: { $toLower: "$category" }, count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  counts.forEach(({ _id, count }) => { if (_id) countMap[_id] = count; });

  const result = categories.map((cat) => ({
    ...cat,
    isDefault: DEFAULT_CATEGORIES.includes(cat.name),
    productCount: countMap[cat.name.toLowerCase()] ?? 0,
  }));

  res.json(result);
=======
  let categories = await Category.find({}).sort({ name: 1 }).lean();

  // Seed defaults on first request if empty
  if (categories.length === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map((name) => ({ name })));
    categories = await Category.find({}).sort({ name: 1 }).lean();
  }

  res.json(categories);
>>>>>>> f89b985b58da9bdb50c90e231e4ddb7a2d3380be
});

// POST /api/categories — admin only
export const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });
  if (existing) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({ name: name.trim() });
  res.status(201).json(category);
});

// PUT /api/categories/:id — admin only
export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
<<<<<<< HEAD
  if (DEFAULT_CATEGORIES.includes(category.name)) {
    res.status(403);
    throw new Error("Built-in categories cannot be edited");
  }
=======
>>>>>>> f89b985b58da9bdb50c90e231e4ddb7a2d3380be

  category.name = name.trim();
  await category.save();
  res.json(category);
});

// DELETE /api/categories/:id — admin only
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
<<<<<<< HEAD
  if (DEFAULT_CATEGORIES.includes(category.name)) {
    res.status(403);
    throw new Error("Built-in categories cannot be deleted");
  }
=======
>>>>>>> f89b985b58da9bdb50c90e231e4ddb7a2d3380be
  await category.deleteOne();
  res.json({ message: "Category deleted" });
});
