"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { getBlogs, getId, updateBlogAuth } from "@/lib/api";
import { Blog } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    getBlogs().then(setBlogs).catch(() => {}).finally(() => setLoading(false));
  }, [router]);

  const toggleStatus = async (blog: Blog) => {
    const blogId = getId(blog);
    const newStatus = blog.status === "published" ? "draft" : "published";
    setTogglingId(blogId);
    try {
      await updateBlogAuth(blogId, { status: newStatus });
      setBlogs((prev) =>
        prev.map((b) => getId(b) === blogId ? { ...b, status: newStatus } : b)
      );
      toast.success(`Blog ${newStatus === "published" ? "published" : "moved to draft"}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-electric-blue" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display-lg text-display-lg-mobile text-primary mb-1">Blogs</h1>
              <p className="font-body-md text-on-surface-variant">{blogs.length} articles total</p>
            </div>
            <Link href="/admin/blogs/new" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-electric-blue transition-colors">
              + New Blog
            </Link>
          </div>

          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
            <div className="grid grid-cols-[1fr_150px_140px_100px] gap-4 p-4 border-b border-outline-variant/20 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              <span>Title</span>
              <span>Category</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {blogs.map((blog) => {
                const blogId = getId(blog);
                const isPublished = blog.status === "published";
                const isToggling = togglingId === blogId;

                return (
                  <div key={blogId} className="grid grid-cols-[1fr_150px_140px_100px] gap-4 p-4 items-center hover:bg-surface-container-low transition-colors">
                    <div className="min-w-0">
                      <p className="font-body-md text-primary font-semibold truncate">{blog.title}</p>
                      <p className="font-label-sm text-[12px] text-on-surface-variant mt-0.5 truncate">
                        {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant capitalize">
                      {blog.categories?.name || "—"}
                    </span>
                    <button
                      onClick={() => toggleStatus(blog)}
                      disabled={isToggling}
                      className={`font-label-sm text-[11px] px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 w-fit uppercase tracking-wide cursor-pointer transition-all hover:opacity-80 disabled:opacity-50 ${
                        isPublished
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
                          : "bg-amber-100 text-amber-700 hover:bg-green-100 hover:text-green-700"
                      }`}
                      title={isPublished ? "Click to unpublish" : "Click to publish"}
                    >
                      {isToggling ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <span className={`w-2 h-2 rounded-full ${isPublished ? "bg-green-500" : "bg-amber-500"}`} />
                      )}
                      {blog.status || "draft"}
                    </button>
                    <Link
                      href={`/admin/blogs/edit/${blogId}`}
                      className="px-3 py-1.5 border border-outline-variant/30 rounded-lg font-label-sm text-[12px] text-primary hover:bg-surface-container transition-colors text-center"
                    >
                      Edit
                    </Link>
                  </div>
                );
              })}
              {blogs.length === 0 && (
                <p className="p-8 text-center text-on-surface-variant">No blogs found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
