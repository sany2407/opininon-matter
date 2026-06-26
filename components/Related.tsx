import Link from "next/link";
import { Blog } from "@/lib/types";
import { getId } from "@/lib/api";

interface RelatedProps {
  blogs: Blog[];
}

export default function Related({ blogs }: RelatedProps) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-24">
      <h2 className="font-headline-md text-headline-md text-primary mb-12">Continue Observing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((blog) => {
          const categoryName =
            typeof blog.category === "object" && blog.category !== null
              ? blog.category.name
              : blog.category || "General";

          return (
            <Link href={`/article/${getId(blog)}`} key={getId(blog)} className="group cursor-pointer block">
              <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4 border border-outline-variant/20 relative">
                {(blog.cover_image || blog.image) ? (
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={blog.title}
                    src={blog.cover_image || blog.image}
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center">
                    <span className="text-on-surface-variant/40 font-label-sm text-label-sm">No image</span>
                  </div>
                )}
              </div>
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">
                {categoryName}
              </span>
              <h3 className="font-headline-md text-[24px] text-primary mt-2 group-hover:text-primary/70 transition-colors leading-[1.2]">
                {blog.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
