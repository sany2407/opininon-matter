"use client";

import Link from "next/link";
import me from "../public/assets/me.png";
import heroImage from "../public/assets/image.png";
import Image from "next/image";
import { Search, SlidersHorizontal, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getBlogs, subscribeNewsletter, getId } from "@/lib/api";
import { Blog } from "@/lib/types";
import { toast } from "sonner";

export default function LandingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  const domainCategories = [
    { name: "Artificial Intelligence", description: "LLMs, neural networks, and the future of machine cognition", icon: "🧠", accent: "#3B82F6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
    { name: "Software Engineering", description: "Architecture, patterns, and the craft of building scalable systems", icon: "⚡", accent: "#8B5CF6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
    { name: "Cloud & DevOps", description: "Infrastructure, serverless, and the art of deployment", icon: "☁️", accent: "#06B6D4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)" },
    { name: "Startups", description: "Growth, product-market fit, and navigating the unknown", icon: "🚀", accent: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
    { name: "Productivity", description: "Deep work, tools, and optimizing the developer workflow", icon: "🎯", accent: "#F97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)" },
    { name: "Future Tech", description: "Emerging trends shaping the next decade of computing", icon: "🔬", accent: "#EC4899", bg: "rgba(236,72,153,0.08)", border: "rgba(236,72,153,0.2)" },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const blogsData = await getBlogs().catch(() => []);
        setBlogs(blogsData);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const submitNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const featuredBlogs = blogs.slice(0, 3);
  const latestBlogs = blogs.slice(0, 6);

  const getCategoryName = (blog: Blog) => {
    if (blog.categories?.name) return blog.categories.name;
    if (typeof blog.category === "object" && blog.category !== null) return blog.category.name;
    return blog.category || "General";
  };

  const getBlogImage = (blog: Blog) => blog.cover_image || blog.image || "";

  const getFormattedDate = (blog: Blog) => {
    const dateStr = blog.published_date || blog.createdAt || blog.created_at;
    if (dateStr) return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    return blog.date || "";
  };

  const getReadTime = (blog: Blog) => blog.readTime || blog.read_time || "";

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-surface-container-lowest">
        {/* Split Layered Background */}
        <div className="absolute inset-0 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-surface"></div>
          <div className="w-full md:w-1/2 relative animate-fade-in">
            <Image
              alt="Abstract visual inspiration"
              className="w-full h-full object-cover grayscale opacity-80 md:opacity-100"
              src={heroImage}
              priority
              fill
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
          </div>
        </div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="hero-glass p-8 md:p-12 shadow-2xl shadow-primary/5 inline-block w-full backdrop-blur-xl">
              <span className="inline-block px-3 py-1 bg-primary text-on-primary font-label-sm text-[10px] tracking-widest uppercase mb-8 animate-fade-up">
                Vol. 2024 / No. 04
              </span>

              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-8 text-primary leading-[1.1] animate-fade-up-delay-1">
                <span className="font-light italic">Opinions</span> Worth{" "}
                <span className="font-bold border-b-4 border-electric-blue/30 pb-1">Reading</span>.{" "}
                <br />
                <span className="font-normal opacity-80">Ideas Worth Discussing.</span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-xl leading-relaxed animate-fade-up-delay-2">
                Exploring technology trends, software development, AI, startups, and the ideas shaping tomorrow through a critical, human-centric lens.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 animate-fade-up-delay-3">
                <Link
                  href="/all-articles"
                  className="group relative bg-primary text-on-primary px-10 py-5 font-label-sm text-label-sm uppercase tracking-widest hover:bg-electric-blue transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Read Articles
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#about" className="border border-outline-variant text-primary px-10 py-5 font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-container transition-colors text-center">
                  About Me
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Interaction Hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-fade-in-delay">
          <span className="font-label-sm text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-electric-blue animate-scroll-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Articles (Bento Style) */}
      <section className="py-20 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center justify-between mb-12 border-b border-outline-variant/30 pb-4">
            <h2 className="font-headline-md text-headline-md">Featured Thinking</h2>
            <Link href="/all-articles" className="font-label-sm text-label-sm text-electric-blue hover:underline flex items-center gap-2">
              View All <span>&rarr;</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-electric-blue" />
            </div>
          ) : featuredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Large Featured Card */}
              <Link href={`/article/${getId(featuredBlogs[0])}`} className="block md:col-span-8 group cursor-pointer">
                <div className="border border-outline-variant/20 hover:border-electric-blue/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-surface-container-lowest h-full flex flex-col relative overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    {getBlogImage(featuredBlogs[0]) ? (
                      <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={featuredBlogs[0].title} src={getBlogImage(featuredBlogs[0])} />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="text-on-surface-variant/40 font-label-sm">No image</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 backdrop-blur-md text-on-primary px-3 py-1 font-label-sm text-[11px] tracking-widest uppercase">{getCategoryName(featuredBlogs[0])}</span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-md text-headline-md mb-4 group-hover:text-electric-blue transition-colors">{featuredBlogs[0].title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3">{featuredBlogs[0].description}</p>
                    </div>
                    <div className="flex items-center justify-between font-label-sm text-[12px] text-on-surface-variant/60 uppercase tracking-widest">
                      {getReadTime(featuredBlogs[0]) && <span>{getReadTime(featuredBlogs[0])}</span>}
                      <span>{getFormattedDate(featuredBlogs[0])}</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Side Column */}
              <div className="md:col-span-4 flex flex-col gap-gutter">
                {featuredBlogs.slice(1, 3).map((blog) => (
                  <Link key={getId(blog)} href={`/article/${getId(blog)}`} className="block border border-outline-variant/20 hover:border-electric-blue/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-surface-container-lowest flex-1 group cursor-pointer overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      {getBlogImage(blog) ? (
                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={blog.title} src={getBlogImage(blog)} />
                      ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                          <span className="text-on-surface-variant/40 font-label-sm">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-electric-blue font-label-sm text-[10px] tracking-widest uppercase mb-3 block">{getCategoryName(blog)}</span>
                      <h3 className="font-headline-md text-xl mb-4 group-hover:text-electric-blue transition-colors leading-snug">{blog.title}</h3>
                      <div className="flex items-center gap-4 font-label-sm text-[11px] text-on-surface-variant/60">
                        {getReadTime(blog) && <span>{getReadTime(blog)}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-on-surface-variant py-12">No articles yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 border-t border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-headline-md mb-4">Explore Domains</h2>
            <p className="font-body-md text-on-surface-variant max-w-xl mx-auto">Deep dives into the specific niches of the digital frontier.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/all-articles?category=${cat.name}`}
                className="group relative overflow-hidden rounded-2xl p-8 flex items-start gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ backgroundColor: cat.bg, border: `1px solid ${cat.border}` }}
              >
                <span
                  className="text-4xl flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${cat.accent}15` }}
                >
                  {cat.icon}
                </span>
                <div className="flex flex-col">
                  <span className="font-headline-md text-xl text-primary group-hover:opacity-80 transition-colors">
                    {cat.name}
                  </span>
                  <span className="font-body-md text-[14px] text-on-surface-variant mt-1 line-clamp-2">{cat.description}</span>
                  <span
                    className="mt-3 font-label-sm text-[12px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: cat.accent }}
                  >
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-24 bg-surface-container-lowest border-y border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-md">
              <h2 className="font-display-lg text-headline-md mb-4">Latest Perspectives</h2>
              <p className="font-body-md text-on-surface-variant">The most recent observations from the laboratory and the keyboard.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:min-w-[300px]">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-electric-blue focus:outline-none rounded-none py-3 pl-10 pr-4 font-label-sm text-label-sm" placeholder="Search articles..." type="text" />
              </div>
              <button className="bg-primary p-3 flex items-center justify-center hover:opacity-80 transition-opacity">
                <SlidersHorizontal size={20} className="text-on-primary" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-electric-blue" />
            </div>
          ) : latestBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-16">
              {latestBlogs.map((blog) => (
                <Link key={getId(blog)} href={`/article/${getId(blog)}`} className="block group cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden mb-6 border border-outline-variant/20 group-hover:border-electric-blue/30 transition-all group-hover:-translate-y-1 group-hover:shadow-xl">
                    {getBlogImage(blog) ? (
                      <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={blog.title} src={getBlogImage(blog)} />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="text-on-surface-variant/40 font-label-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <span className="font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase">{getCategoryName(blog)}</span>
                    <h3 className="font-headline-md text-2xl group-hover:text-electric-blue transition-colors">{blog.title}</h3>
                    <p className="font-body-md text-on-surface-variant line-clamp-2">{blog.description}</p>
                    <div className="flex items-center gap-4 font-label-sm text-[11px] text-on-surface-variant/40">
                      <span>{getFormattedDate(blog)}</span>
                      {getReadTime(blog) && <><span>•</span><span>{getReadTime(blog)}</span></>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-on-surface-variant py-12">No articles yet.</p>
          )}

          <div className="mt-20 text-center">
            <Link href="/all-articles" className="inline-block border border-primary text-primary px-12 py-5 font-label-sm text-label-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all duration-300">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* About Author Section */}
      <section id="about" className="py-24 overflow-hidden bg-white dark:bg-surface border-b border-outline-variant/20 scroll-mt-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-square bg-surface-container-high relative overflow-hidden z-10">
                <Image className="w-full h-full object-cover grayscale" alt="A sophisticated black and white portrait" src={me} />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-electric-blue/30 -z-0"></div>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-electric-blue uppercase tracking-widest mb-4 block">The Voice Behind the Words</span>
              <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-8 leading-tight">AI Full Stack Developer passionate about building scalable software and dissecting the future of human-computer interaction.</h2>
              <div className="space-y-6 font-body-md text-on-surface-variant mb-10">
                <p>Currently engineering the next generation of generative tools by day, and writing about the socio-technical impact of code by night. I believe code is our generation{"'s"} most powerful form of literature.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="w-3 h-[1px] bg-electric-blue inline-block"></span>
                    2+ Years in Full Stack Development
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-3 h-[1px] bg-electric-blue inline-block"></span>
                    Open Source Contributor
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-3 h-[1px] bg-electric-blue inline-block"></span>
                    Digital Nomad & Minimalist
                  </li>
                </ul>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="text-primary hover:text-electric-blue transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22.23 0H1.77C.8 0 0 .8 0 1.77v20.46C0 23.2.8 24 1.77 24h20.46c.98 0 1.77-.8 1.77-1.77V1.77C24 .8 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.58c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.62 0 4.28 2.38 4.28 5.48v6.27z"></path></svg>
                </a>
                <a href="#" className="text-primary hover:text-electric-blue transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
                </a>
                <a href="#" className="text-primary hover:text-electric-blue transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 relative bg-primary overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md text-on-primary mb-6">Get fresh perspectives delivered weekly.</h2>
            <p className="font-body-md text-on-primary-container mb-10 opacity-80">Join 15,000+ readers who receive my weekly digest on technology, human intent, and digital evolution. No spam, just substance.</p>
            <form onSubmit={submitNewsletter} className="flex flex-col sm:flex-row gap-0 group">
              <input
                name="email"
                className="flex-1 bg-white border-none focus:ring-0 focus:outline-none px-6 py-5 text-[#1a1c1d] font-body-md"
                placeholder="Your email address"
                required
                type="email"
                disabled={subscribing}
              />
              <button
                className="bg-electric-blue text-white px-10 py-5 font-label-sm text-label-sm uppercase tracking-widest hover:bg-blue-600 transition-colors whitespace-nowrap disabled:opacity-50"
                type="submit"
                disabled={subscribing}
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <p className="mt-4 font-label-sm text-[11px] text-white/60">By subscribing, you agree to our Privacy Policy and can unsubscribe at any time.</p>
          </div>
        </div>

        {/* Background abstraction */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue blur-[150px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-[100px] translate-y-1/2 -translate-x-1/2 rounded-full"></div>
        </div>
      </section>
    </div>
  );
}
