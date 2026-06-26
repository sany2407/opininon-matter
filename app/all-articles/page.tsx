"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { getBlogs, getCategories, subscribeNewsletter, getId } from "@/lib/api";
import { Blog, Category } from "@/lib/types";
import { toast } from "sonner";

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [blogsData, categoriesData] = await Promise.all([
          getBlogs().catch(() => []),
          getCategories().catch(() => []),
        ]);
        setBlogs(blogsData);
        setCategories(categoriesData);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribing(true);
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    try {
      await subscribeNewsletter(email);
      toast.success("Welcome aboard! 🎉", {
        description: "You've been subscribed to our weekly newsletter.",
      });
      form.reset();
    } catch (err: unknown) {
      let message = "Something went wrong. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        message = axiosErr.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error("Failed to subscribe", {
        description: message,
      });
    } finally {
      setSubscribing(false);
    }
  };

  const categoryNames = ["All", ...categories.map((c) => c.name)];

  const getCategoryName = (blog: Blog) => {
    if (blog.categories?.name) return blog.categories.name;
    if (typeof blog.category === "object" && blog.category !== null) return blog.category.name;
    return blog.category || "General";
  };

  const getBlogImage = (blog: Blog) => blog.cover_image || blog.image || "";

  const filteredBlogs = activeCategory === "All"
    ? blogs
    : blogs.filter((b) => getCategoryName(b).toLowerCase() === activeCategory.toLowerCase());

  const featuredBlog = filteredBlogs[0];
  const gridBlogs = filteredBlogs.slice(1);

  return (
    <div className="pt-20">
      <header className="pt-20 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="max-w-article-max">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4 block">The Digital Observer</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Thoughts on technology, culture, and the future of work.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">Deep dives into the tools and trends shaping our collective digital intelligence.</p>
        </div>
      </header>

      {/* Filter & Sort Bar */}
      <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-outline-variant/20 mb-12">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all border border-transparent ${
                  activeCategory === cat
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container hover:bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-outline-variant/20">
            <span className="font-label-sm text-label-sm text-secondary whitespace-nowrap">Sort by:</span>
            <select className="bg-transparent border-none font-label-sm text-label-sm text-primary focus:ring-0 cursor-pointer p-0 pr-8 outline-none">
              <option>Newest</option>
              <option>Trending</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-electric-blue" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-center text-on-surface-variant py-20">No articles found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Featured Article */}
            {featuredBlog && (
              <Link href={`/article/${getId(featuredBlog)}`} className="md:col-span-8 group cursor-pointer block">
                <div className="relative overflow-hidden aspect-[16/9] mb-6 rounded-lg bg-surface-container border border-outline-variant/20 hover:border-electric-blue/30 transition-colors">
                  {getBlogImage(featuredBlog) ? (
                    <img className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" alt={featuredBlog.title} src={getBlogImage(featuredBlog)} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-on-surface-variant/40 font-label-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-sm">Featured</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                    <span>{getCategoryName(featuredBlog)}</span>
                    {featuredBlog.readTime && (
                      <>
                        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                        <span>{featuredBlog.readTime}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-headline-md text-headline-md text-primary group-hover:text-electric-blue transition-colors">{featuredBlog.title}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl line-clamp-3">{featuredBlog.description}</p>
                </div>
              </Link>
            )}

            {/* Sidebar */}
            <aside className="md:col-span-4 flex flex-col gap-12 mt-12 md:mt-0">
              <div>
                <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-8 border-b border-primary pb-2 inline-block">Trending Now</h3>
                <div className="flex flex-col gap-8">
                  {filteredBlogs.slice(0, 3).map((blog, idx) => (
                    <Link key={getId(blog)} href={`/article/${getId(blog)}`} className="group cursor-pointer block">
                      <span className="font-display-lg text-[40px] text-outline-variant leading-none opacity-40 group-hover:opacity-100 transition-opacity">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-body-lg text-body-lg text-primary font-semibold mt-2 group-hover:text-electric-blue transition-colors">{blog.title}</h4>
                      <p className="font-label-sm text-label-sm text-secondary mt-1">
                        {blog.readTime || ""} • {getCategoryName(blog)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-low p-8 rounded-lg border border-outline-variant/30">
                <h3 className="font-headline-md text-[24px] text-primary mb-4">Weekly Insights</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Join 12,000+ digital observers receiving our curated Sunday newsletter.</p>
                <form className="flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
                  <input
                    name="email"
                    className="bg-surface border border-outline-variant px-4 py-3 text-body-md focus:border-electric-blue focus:ring-0 focus:outline-none transition-all"
                    placeholder="email@address.com"
                    type="email"
                    required
                    disabled={subscribing}
                  />
                  <button type="submit" disabled={subscribing} className="bg-primary text-on-primary py-3 px-6 font-label-sm text-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50">
                    {subscribing ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              </div>
            </aside>

            {/* Standard Grid */}
            {gridBlogs.map((blog) => (
              <Link key={getId(blog)} href={`/article/${getId(blog)}`} className="md:col-span-4 group cursor-pointer mt-12 block border border-transparent hover:border-electric-blue/30 rounded-lg p-2 -m-2 transition-all">
                <div className="relative overflow-hidden aspect-video mb-6 rounded-lg bg-surface-container">
                  {getBlogImage(blog) ? (
                    <img className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" alt={blog.title} src={getBlogImage(blog)} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-on-surface-variant/40 font-label-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">{getCategoryName(blog)}</span>
                  <h3 className="font-body-lg text-body-lg font-semibold text-primary group-hover:text-electric-blue transition-colors">{blog.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{blog.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
