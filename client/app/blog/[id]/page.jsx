import SingleBlogPage from "@/components/blog/SingleBlogPage";

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/single`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: params.id }),
        next: { revalidate: 60 },
      }
    );

    const { blog } = await res.json();

    return {
      title: blog?.title || "Jonadest Blog",
      description:
        blog?.subTitle || "Explore amazing tech content on Jonadest.",
      openGraph: {
        title: blog?.title,
        description: blog?.subTitle,
        url: `https://www.jonadest.com/blog/${params.id}`,
        siteName: "Jonadest Blog",
        images: [
          {
            url:
              blog?.image ||
              "https://ik.imagekit.io/jonadest/Samples/og-image.jpg",
            width: 1200,
            height: 630,
            alt: blog?.title || "Jonadest Blog",
          },
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: blog?.title,
        description: blog?.subTitle,
        images: [
          blog?.image || "https://ik.imagekit.io/jonadest/Samples/og-image.jpg",
        ],
      },
    };
  } catch (error) {
    return {
      title: "Jonadest Blog",
      description: "Explore amazing tech content on Jonadest.",
    };
  }
}

export default function BlogPage({ params }) {
  return <SingleBlogPage id={params.id} />;
}
