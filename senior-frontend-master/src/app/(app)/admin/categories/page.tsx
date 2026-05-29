"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";

type Category = { _id: string; name: string; createdAt: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://dakesh-backend.onrender.com";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const token = Cookies.get("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(res.data);
    } catch {
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setIsAdding(true);
    setAddError(null);
    try {
      const res = await axios.post(`${API_BASE}/api/categories`, { name: newName.trim() }, { headers });
      setCategories((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
    } catch (err: any) {
      setAddError(err.response?.data?.message || "Failed to add category");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await axios.put(`${API_BASE}/api/categories/${id}`, { name: editName.trim() }, { headers });
      setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)).sort((a, b) => a.name.localeCompare(b.name)));
      setEditingId(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products using it will keep the name but it won't appear in filters.`)) return;
    try {
      await axios.delete(`${API_BASE}/api/categories/${id}`, { headers });
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6">
      <button onClick={() => window.history.back()} className="mb-6 text-brand-200 hover:text-brand-100 text-sm font-semibold transition-colors">
        ← Go Back
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          Manage <span className="text-brand-400">Categories</span>
        </h1>
        <p className="text-slate-400 text-sm mb-8">Add, edit, or remove product categories.</p>

        {/* Add Category */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Add New Category</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Category name..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={isAdding || !newName.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {isAdding ? "Adding..." : "Add"}
            </button>
          </div>
          {addError && <p className="text-red-400 text-xs mt-2">{addError}</p>}
        </div>

        {/* Categories List */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              All Categories
            </h2>
            <span className="text-xs text-slate-500">{categories.length} total</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-400 text-sm">{error}</div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No categories yet.</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {categories.map((cat) => (
                <li key={cat._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group">
                  {editingId === cat._id ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEdit(cat._id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="flex-1 bg-white/10 border border-brand-500/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-brand-500"
                      />
                      <button onClick={() => handleEdit(cat._id)} className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-white/10 text-slate-400 hover:bg-white/20 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-white font-medium">{cat.name}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingId(cat._id); setEditName(cat.name); }}
                          className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
