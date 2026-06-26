"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { getBlogs, getCategories, getId } from "@/lib/api";
import { Blog, Category } from "@/lib/types";
import { FileText, Tag, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    async function fetchData() {
      try {
        const [b, c] = await Promise.all([getBlogs(), getCategories()]);
        setBlogs(b);
        setCategories(c);
      } catch { /* empty */ }
      finally { setLoading(false); }
    }
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-electric-blue" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-5xl">
          <h1 className="font-display-lg text-display-lg-mobile text-primary mb-2">Dashboard</h1>
          <p className="font-body-md text-on-surface-variant mb-10">Manage your blog content and categories.</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(59,130,246,0.1)" }}>
                  <FileText size={22} style={{ color: "#3B82F6" }} />
                </div>
                <div>
                  <p className="font-display-lg text-headline-md text-primary">{blogs.length}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Total Blogs</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(16,185,129,0.1)" }}>
                  <Tag size={22} style={{ color: "#10B981" }} />
                </div>
                <div>
                  <p className="font-display-lg text-headline-md text-primary">{categories.length}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Categories</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.1)" }}>
                  <Eye size={22} style={{ color: "#8B5CF6" }} />
                </div>
                <div>
                  <p className="font-display-lg text-headline-md text-primary">{blogs.filter(b => b.status === "published").length}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Published</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Blogs */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
              <h2 className="font-headline-md text-xl text-primary">Recent Blogs</h2>
              <Link href="/admin/blogs/new" className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-electric-blue transition-colors">
                + New Blog
              </Link>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {blogs.slice(0, 5).map((blog) => (
                <div key={getId(blog)} className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-primary font-semibold truncate">{blog.title}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                      {blog.categories?.name || "Uncategorized"} • {blog.status || "draft"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/blogs/edit/${getId(blog)}`}
                    className="px-4 py-2 border border-outline-variant/30 rounded-lg font-label-sm text-label-sm text-primary hover:bg-surface-container transition-colors ml-4"
                  >
                    Edit
                  </Link>
                </div>
              ))}
              {blogs.length === 0 && (
                <p className="p-6 text-center text-on-surface-variant">No blogs yet. Create your first one!</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
