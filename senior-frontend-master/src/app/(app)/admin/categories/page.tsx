"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Pencil, Trash2, Plus, Check, X, Tag } from "lucide-react";

type Category = { _id: string; name: string; createdAt: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://dakesh-backend.onrender.com";

const CATEGORY_COLORS = [
  "from-violet-500/20 to-purple-500/10 border-violet-500/30",
  "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
  "from-emerald-500/20 to-green-500/10 border-emerald-500/30",
  "from-orange-500/20 to-amber-500/10 border-orange-500/30",
  "from-pink-500/20 to-rose-500/10 border-pink-500/30",
  "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
  "from-indigo-500/20 to-blue-500/10 border-indigo-500/30",
];

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

  useEffect(() => { fetchCategories(); }, []);

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
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API_BASE}/api/categories/${id}`, { headers });
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-8">
      <button onClick={() => window.history.back()} className="mb-8 flex items-center gap-2 text-brand-300 hover:text-brand-200 text-sm font-semibold transition-colors">
        ← Go Back
      </button>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">
            Manage <span className="text-brand-400">Categories</span>
          </h1>
          <p className="text-slate-400 text-sm">{categories.length} categories total</p>
        </div>

        {/* Add Category Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Add New Category</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Sports, Garden, Music..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-sm"
            />
            <button
              onClick={handleAdd}
              disabled={isAdding || !newName.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/30 text-sm"
            >
              <Plus className="w-4 h-4" />
              {isAdding ? "Adding..." : "Add"}
            </button>
          </div>
          {addError && <p className="text-red-400 text-xs mt-2">{addError}</p>}
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-400 py-12">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-slate-400 py-12">No categories yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, i) => {
              const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              return (
                <div
                  key={cat._id}
                  className={`group relative overflow-hidden bg-gradient-to-br ${color} border rounded-2xl p-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
                >
                  {editingId === cat._id ? (
                    /* Edit mode */
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEdit(cat._id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-brand-400"
                      />
                      <button onClick={() => handleEdit(cat._id)} className="p-1.5 rounded-lg bg-green-500/30 text-green-400 hover:bg-green-500/50 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* View mode */
                    <>
                      <div className="flex items-start justify-between gap-2">
                        {/* Icon + name */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                            <Tag className="w-4 h-4 text-white/70" />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{cat.name}</p>
                            <p className="text-white/40 text-xs mt-0.5">
                              {new Date(cat.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => { setEditingId(cat._id); setEditName(cat.name); }}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id, cat.name)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
