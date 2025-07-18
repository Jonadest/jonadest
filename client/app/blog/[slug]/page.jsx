import SingleBlogPage from "@/components/blog/SingleBlogPage";

export async function generateMetadata({ params }) {
  const { slug } = params; // ✅ no need for `await`

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/slug/${slug}`,
      { cache: "no-store" }
    );

    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      throw new Error("Invalid response");
    }

    const { blog } = await res.json();

    const title = blog?.title || "Jonadest Blog";
    const description =
      blog?.subTitle || "Explore amazing tech content on Jonadest.";
    const image = blog?.image?.startsWith("http")
      ? blog.image
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}${blog.image}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.jonadest.com/blog/${slug}`, // ✅ correct domain
        type: "article",
        images: image
          ? [
              {
                url: image,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : [],
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

export default function BlogPage({ params }) {
  return <SingleBlogPage slug={params.slug} />; // ✅ no `await` needed
}
