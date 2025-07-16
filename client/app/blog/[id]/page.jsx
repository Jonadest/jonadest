import SingleBlogPage from "@/components/blog/SingleBlogPage";

// Optional static fallback metadata
export async function generateMetadata() {
  return {
    title: "Jonadest Blog",
    description: "Explore amazing tech content on Jonadest.",
  };
}

// Dynamic route handler
export default function BlogPage({ params }) {
  return <SingleBlogPage id={params.id} />;
}
