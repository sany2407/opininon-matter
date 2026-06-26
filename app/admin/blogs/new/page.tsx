"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { getCategories, createBlogAuth } from "@/lib/api";
import { Category } from "@/lib/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [status, setStatus] = useState("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    getCategories().then(setCategories).catch(() => {});
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setCoverImage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      await createBlogAuth({
        title,
        content,
        category_id: categoryId ? Number(categoryId) : undefined,
        cover_image: !coverFile ? coverImage || undefined : undefined,
        coverFile: coverFile || undefined,
        status,
      });
      toast.success("Blog created successfully!");
      router.push("/admin/blogs");
    } catch (err: unknown) {
      let message = "Failed to create blog";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { error?: string; message?: string } } };
        message = axiosErr.response?.data?.error || axiosErr.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="font-display-lg text-display-lg-mobile text-primary mb-2">Create New Blog</h1>
          <p className="font-body-md text-on-surface-variant mb-8">Write and publish a new article.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 px-4 py-3 font-body-md text-primary focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none rounded-lg"
                placeholder="Enter blog title..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 px-4 py-3 font-body-md text-primary focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none rounded-lg"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={String(cat.id ?? cat._id)} value={String(cat.id ?? cat._id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 px-4 py-3 font-body-md text-primary focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none rounded-lg"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => { setCoverImage(e.target.value); setCoverFile(null); setCoverPreview(""); }}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 px-4 py-3 font-body-md text-primary focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Or Upload Cover Image</label>
              <div className="flex items-start gap-6">
                <label className="flex-1 border-2 border-dashed border-outline-variant/30 rounded-xl p-6 text-center cursor-pointer hover:border-electric-blue/50 transition-colors">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Click to upload or drag & drop</p>
                  <p className="font-label-sm text-[11px] text-on-surface-variant/50 mt-1">PNG, JPG, WebP up to 5MB</p>
                </label>
                {(coverPreview || coverImage) && (
                  <div className="w-40 h-24 rounded-lg overflow-hidden border border-outline-variant/20 flex-shrink-0">
                    <img src={coverPreview || coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Content</label>
              <div className="border border-outline-variant/30 rounded-lg overflow-hidden bg-surface-container-lowest">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  className="admin-editor"
                  placeholder="Write your article..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-electric-blue transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "Publishing..." : "Publish Blog"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 border border-outline-variant/30 rounded-lg font-label-sm text-label-sm text-primary hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
