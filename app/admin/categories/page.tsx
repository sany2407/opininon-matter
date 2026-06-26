"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { getCategories, createCategoryAuth, getId } from "@/lib/api";
import { Category } from "@/lib/types";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch { /* empty */ }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    setCreating(true);
    try {
      await createCategoryAuth(name, description);
      toast.success("Category created!");
      setName("");
      setDescription("");
      setShowForm(false);
      await fetchCategories();
    } catch (err: unknown) {
      let message = "Failed to create category";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { error?: string; message?: string } } };
        message = axiosErr.response?.data?.error || axiosErr.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-electric-blue" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display-lg text-display-lg-mobile text-primary mb-1">Categories</h1>
              <p className="font-body-md text-on-surface-variant">{categories.length} categories total</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-electric-blue transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> New Category
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="mb-8 p-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest space-y-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body-md text-primary focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none rounded-lg"
                  placeholder="e.g. Technology"
                  required
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Description (optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body-md text-primary focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none rounded-lg"
                  placeholder="A short description..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm hover:bg-electric-blue transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  {creating ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-outline-variant/30 rounded-lg font-label-sm text-label-sm text-primary hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_150px] gap-4 p-4 border-b border-outline-variant/20 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              <span>Name</span>
              <span>Description</span>
              <span>Created</span>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {categories.map((cat) => (
                <div key={getId(cat)} className="grid grid-cols-[1fr_1fr_150px] gap-4 p-4 items-center hover:bg-surface-container-low transition-colors">
                  <span className="font-body-md text-primary font-semibold capitalize">{cat.name}</span>
                  <span className="font-body-md text-on-surface-variant text-[14px] truncate">{cat.description || "—"}</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">
                    {cat.created_at ? new Date(cat.created_at).toLocaleDateString() : "—"}
                  </span>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="p-8 text-center text-on-surface-variant">No categories yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
