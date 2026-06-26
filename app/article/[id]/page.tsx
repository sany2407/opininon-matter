import { getBlogById, getBlogs, getId } from "@/lib/api";
import ArticleContent from "@/components/ArticleContent";
import Related from "@/components/Related";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const blog = await getBlogById(id).catch(() => null);

  if (!blog) {
    notFound();
  }

  // Fetch related blogs (excluding current)
  const allBlogs = await getBlogs().catch(() => []);
  const relatedBlogs = allBlogs
    .filter((b) => getId(b) !== getId(blog))
    .slice(0, 3);

  return (
    <div className="pt-32 pb-24 font-body-md">
      <ArticleContent blog={blog} />
      <Related blogs={relatedBlogs} />
    </div>
  );
}
