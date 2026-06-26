"use client";

import { Share2, Link as LinkIcon, Clock, ThumbsUp, Bookmark, MessageCircle, ArrowUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Blog } from "@/lib/types";

interface ArticleContentProps {
  blog: Blog;
}

function estimateReadTime(html: string): string {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default function ArticleContent({ blog }: ArticleContentProps) {
  const [progress, setProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  const categoryName =
    blog.categories?.name ||
    (typeof blog.category === "object" && blog.category !== null
      ? blog.category.name
      : blog.category) ||
    "General";

  const formattedDate = blog.published_date || blog.createdAt || blog.created_at
    ? new Date((blog.published_date || blog.createdAt || blog.created_at)!).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : blog.date || "";

  const readTime = blog.readTime || blog.read_time || (blog.content ? estimateReadTime(blog.content) : "");

  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      const rect = articleRef.current.getBoundingClientRect();
      const articleTop = articleRef.current.offsetTop;
      const articleHeight = articleRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const start = articleTop - windowHeight;
      const end = articleTop + articleHeight;
      const current = scrollY - start;
      const total = end - start;

      setProgress(Math.min(100, Math.max(0, (current / total) * 100)));
      setShowScrollTop(scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-20 left-0 w-full h-[3px] z-50 bg-outline-variant/20">
        <div
          className="h-full bg-electric-blue transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Article Header */}
      <header className="max-w-article-max mx-auto px-margin-mobile md:px-0 mb-12">
        {/* Category & Read Time */}
        <div className="flex items-center gap-3 mb-8">
          <span className="bg-electric-blue/10 text-electric-blue px-3 py-1 font-label-sm text-label-sm rounded-full uppercase tracking-wide">
            {categoryName}
          </span>
          {readTime && (
            <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
              <Clock size={14} /> {readTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight text-primary">
          {blog.title}
        </h1>

        {/* Description / Subtitle */}
        {blog.description && (
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-8 max-w-2xl">
            {blog.description}
          </p>
        )}

        {/* Author & Date Row */}
        <div className="flex items-center justify-between border-t border-b border-outline-variant/20 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-sm text-label-sm">
              {(blog.author || "O")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-primary font-semibold">{blog.author || "Opinion Matters"}</p>
              <p className="text-on-surface-variant text-[12px] font-label-sm">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={copyLink} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all" title="Copy link">
              <LinkIcon size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all" title="Share">
              <Share2 size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all" title="Bookmark">
              <Bookmark size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {(blog.cover_image || blog.image) && (
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
          <div className="w-full aspect-[2/1] md:aspect-[2.5/1] rounded-xl overflow-hidden relative">
            <img
              className="w-full h-full object-cover"
              alt={blog.title}
              src={blog.cover_image || blog.image}
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article
        ref={articleRef}
        className="article-prose max-w-article-max mx-auto px-margin-mobile md:px-0"
      >
        {blog.content ? (
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        ) : (
          <div>
            <p>{blog.description}</p>
          </div>
        )}
      </article>

      {/* Bottom Action Bar */}
      <div className="max-w-article-max mx-auto px-margin-mobile md:px-0 mt-16 pt-8 border-t border-outline-variant/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
              <span className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/40 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                <ThumbsUp size={16} />
              </span>
              <span className="font-label-sm text-label-sm">Applaud</span>
            </button>
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
              <span className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/40 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                <MessageCircle size={16} />
              </span>
              <span className="font-label-sm text-label-sm">Respond</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={copyLink} className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/40 hover:border-primary text-on-surface-variant hover:text-primary transition-all" title="Copy link">
              <LinkIcon size={16} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/40 hover:border-primary text-on-surface-variant hover:text-primary transition-all" title="Bookmark">
              <Bookmark size={16} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/40 hover:border-primary text-on-surface-variant hover:text-primary transition-all" title="Share">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Author Card */}
      <div className="max-w-article-max mx-auto px-margin-mobile md:px-0 mt-16 p-8 bg-surface-container-low rounded-xl border border-outline-variant/20">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary font-display-lg text-xl flex-shrink-0">
            {(blog.author || "O")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-headline-md text-xl text-primary mb-1">{blog.author || "Opinion Matters"}</p>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">Exploring the intersection of technology, design, and the human experience.</p>
            <button className="bg-primary text-on-primary px-5 py-2 rounded-full font-label-sm text-label-sm hover:opacity-90 transition-opacity">
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top FAB */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:bg-electric-blue transition-all duration-300 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
