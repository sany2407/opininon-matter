import axios from "axios";
import { Blog, Category } from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

/** Normalize blog/category id to string */
export function getId(item: { id?: number | string; _id?: string }): string {
  return String(item.id ?? item._id ?? "");
}

// ─── Blogs ─────────────────────────────────────────────────────────────────────

export async function getBlogs(): Promise<Blog[]> {
  const { data } = await api.get("/api/blogs");
  const blogs = data.data ?? data.blogs ?? data;
  return Array.isArray(blogs) ? blogs : [];
}

export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const { data } = await api.get(`/api/blogs/${id}`);
    return data.data ?? data.blog ?? data;
  } catch {
    return null;
  }
}

export async function createBlog(blog: Partial<Blog>): Promise<Blog> {
  const { data } = await api.post("/api/blogs", blog);
  return data.data ?? data.blog ?? data;
}

export async function updateBlog(id: string, blog: Partial<Blog>): Promise<Blog> {
  const { data } = await api.put(`/api/blogs/${id}`, blog);
  return data.data ?? data.blog ?? data;
}

// ─── Categories ─────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get("/api/categories");
  const categories = data.data ?? data.categories ?? data;
  return Array.isArray(categories) ? categories : [];
}

export async function createCategory(name: string): Promise<Category> {
  const { data } = await api.post("/api/categories", { name });
  return data.data ?? data.category ?? data;
}

// ─── Newsletter ─────────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
  const { data } = await api.post("/api/newsletter/subscribe", { email });
  return data;
}

// ─── Auth ───────────────────────────────────────────────────────────────────────

export async function login(username: string, password: string): Promise<{ token: string }> {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data;
}

/** Create an authenticated axios instance */
export function getAuthApi() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// ─── Authenticated Blog Operations ─────────────────────────────────────────────

export async function createBlogAuth(blog: Partial<Blog> & { coverFile?: File }): Promise<Blog> {
  const authApi = getAuthApi();
  const formData = new FormData();

  if (blog.title) formData.append("title", blog.title);
  if (blog.content) formData.append("content", blog.content);
  if (blog.slug) formData.append("slug", blog.slug);
  if (blog.category_id) formData.append("category_id", String(blog.category_id));
  if (blog.status) formData.append("status", blog.status);
  if (blog.published_date) formData.append("published_date", blog.published_date);
  if (blog.cover_image) formData.append("cover_image", blog.cover_image);
  if (blog.coverFile) formData.append("cover_image", blog.coverFile);

  const { data } = await authApi.post("/api/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data ?? data.blog ?? data;
}

export async function updateBlogAuth(id: string, blog: Partial<Blog> & { coverFile?: File }): Promise<Blog> {
  const authApi = getAuthApi();
  const formData = new FormData();

  if (blog.title) formData.append("title", blog.title);
  if (blog.content) formData.append("content", blog.content);
  if (blog.slug) formData.append("slug", blog.slug);
  if (blog.category_id) formData.append("category_id", String(blog.category_id));
  if (blog.status) formData.append("status", blog.status);
  if (blog.published_date) formData.append("published_date", blog.published_date);
  if (blog.cover_image) formData.append("cover_image", blog.cover_image);
  if (blog.coverFile) formData.append("cover_image", blog.coverFile);

  const { data } = await authApi.put(`/api/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data ?? data.blog ?? data;
}

// ─── Authenticated Category Operations ──────────────────────────────────────────

export async function createCategoryAuth(name: string, description?: string): Promise<Category> {
  const authApi = getAuthApi();
  const { data } = await authApi.post("/api/categories", { name, description });
  return data.data ?? data.category ?? data;
}
