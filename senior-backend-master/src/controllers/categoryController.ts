import asyncHandler from "express-async-handler";
import Category from "../models/Category";

const DEFAULT_CATEGORIES = ["Electronics", "Clothing", "Books", "Toys", "Home", "Automobiles", "Other"];

// GET /api/categories — public
export const getCategories = asyncHandler(async (req, res) => {
  let categories = await Category.find({}).sort({ name: 1 }).lean();

  // Seed defaults on first request if empty
  if (categories.length === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map((name) => ({ name })));
    categories = await Category.find({}).sort({ name: 1 }).lean();
  }

  res.json(categories);
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
  await category.deleteOne();
  res.json({ message: "Category deleted" });
});
