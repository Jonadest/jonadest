import SingleBlogPage from "@/components/blog/SingleBlogPage";
import { fetchBlogMetadata } from "@/lib/blogMetadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return await fetchBlogMetadata(slug);
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  return <SingleBlogPage slug={slug} />;
}
