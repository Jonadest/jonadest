import BlogPostContent from "./BlogPostContent";

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/slug/${slug}`
    );
    const data = await res.json();

    if (!data.success) {
      return { title: "Blog not found" };
    }

    const blog = data.blog;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.jonadest.com";
    const blogUrl = `${siteUrl}/blog/${slug}`;
    const imageUrl = blog.image?.startsWith("http")
      ? blog.image
      : `${siteUrl}/${blog.image}`;

    return {
      title: blog.title,
      description: blog.subTitle || "A blog post from Jonadest Tech",
      keywords: blog.title.split(" "),
      alternates: {
        canonical: blogUrl,
      },
      openGraph: {
        type: "article",
        url: blogUrl,
        title: blog.title,
        description: blog.subTitle || "A blog post from Jonadest Tech",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        siteName: "Jonadest",
      },
      twitter: {
        card: "summary_large_image",
        site: "@Jonadestboss",
        title: blog.title,
        description: blog.subTitle,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return {
      title: "Error fetching blog",
      description: "There was an error loading this blog post.",
    };
  }
}

export default function BlogPostPage({ params }) {
  return <BlogPostContent slug={params.slug} />;
}
