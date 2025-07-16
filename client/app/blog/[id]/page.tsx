import SingleBlogPage from "@/components/blog/SingleBlogPage";
import { Metadata } from "next";

// ✅ Optional static fallback metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Jonadest Blog",
    description: "Explore amazing tech content on Jonadest.",
  };
}

// ✅ Dynamic route handling
export default function BlogPage({ params }: { params: { id: string } }) {
  return <SingleBlogPage id={params.id} />;
}
