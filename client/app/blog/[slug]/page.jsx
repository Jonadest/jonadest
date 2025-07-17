import SingleBlogPage from "@/components/blog/SingleBlogPage";

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/${slug}`,
      { cache: "no-store" }
    );

    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      throw new Error("Invalid response type or status");
    }

    const blog = await res.json();

    return {
      title: blog?.title || "Jonadest Blog",
      description:
        blog?.subTitle || "Explore amazing tech content on Jonadest.",
      openGraph: {
        title: blog?.title || "Jonadest Blog",
        description:
          blog?.subTitle || "Explore amazing tech content on Jonadest.",
        url: `https://yourdomain.com/blog/${slug}`,
        images: blog?.imageUrl
          ? [
              {
                url: blog.imageUrl,
                width: 1200,
                height: 630,
                alt: blog.title || "Jonadest Blog",
              },
            ]
          : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: blog?.title || "Jonadest Blog",
        description:
          blog?.subTitle || "Explore amazing tech content on Jonadest.",
        images: blog?.imageUrl ? [blog.imageUrl] : [],
      },
    };
  } catch (err) {
    console.error("Metadata fetch error:", err);
    return {
      title: "Jonadest Blog",
      description: "Explore amazing tech content on Jonadest.",
    };
  }
}

export default async function BlogPage({ params }) {
  return <SingleBlogPage slug={params.slug} />;
}
