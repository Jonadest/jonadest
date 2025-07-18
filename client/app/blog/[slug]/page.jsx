import BlogPostContent from "./BlogPostContent";

// Metadata must be in the same file
export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "172.20.10.8:5000"
      }/api/blog/slug/${slug}`
    );
    const data = await res.json();

    if (!data.success) return { title: "Blog not found" };

    return {
      title: data.blog.title,
      description: data.blog.subTitle || "A blog post from Jonadest Tech",
      openGraph: {
        title: data.blog.title,
        description: data.blog.subTitle,
        images: [{ url: data.blog.image }],
      },
    };
  } catch (error) {
    return { title: "Error fetching blog" };
  }
}

export default function BlogPostPage({ params }) {
  return <BlogPostContent slug={params.slug} />;
}
