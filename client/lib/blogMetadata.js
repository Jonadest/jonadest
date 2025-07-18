// lib/blogMetadata.js
export async function fetchBlogMetadata(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return {
        title: "Blog Not Found",
        description: "This blog does not exist on Jonadest Tech Blog.",
      };
    }

    const blog = await res.json();

    return {
      title: blog.title || "Blog",
      description:
        blog.description || "Read this article on Jonadest Tech Blog",
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Error",
      description: "Could not load blog metadata.",
    };
  }
}
