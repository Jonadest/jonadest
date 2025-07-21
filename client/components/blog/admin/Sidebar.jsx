"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === "/blog/admin") return pathname === "/blog/admin";
    return pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `flex items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer transition-all ${
      isActive(path) ? "bg-base-200 border-base-300 border-r-4" : ""
    }`;

  return (
    <div className="flex flex-col border-r border-base-300 min-h-full pt-6 sideB">
      <Link href="/blog/admin" className={linkClass("/blog/admin")}>
        <DashboardIcon />
        <p className="hidden md:inline-block">Dashboard</p>
      </Link>

      <Link href="/blog/admin/add" className={linkClass("/blog/admin/add")}>
        <AddIcon />
        <p className="hidden md:inline-block">Add Blogs</p>
      </Link>

      <Link
        href="/blog/admin/listBlog"
        className={linkClass("/blog/admin/listBlog")}
      >
        <ListIcon />
        <p className="hidden md:inline-block">Blogs List</p>
      </Link>

      <Link
        href="/blog/admin/comments"
        className={linkClass("/blog/admin/comments")}
      >
        <CommentsIcon />
        <p className="hidden md:inline-block">Comments</p>
      </Link>

      <Link
        href="/blog/admin/edit-blog"
        className={linkClass("/blog/admin/edit-blog")}
      >
        <EditIcon />
        <p className="hidden md:inline-block">Edit</p>
      </Link>

      <Link
        href="/blog/admin/drafts"
        className={linkClass("/blog/admin/drafts")}
      >
        <DraftsIcon />
        <p className="hidden md:inline-block">Drafts</p>
      </Link>
    </div>
  );
};

export default Sidebar;

const DashboardIcon = () => (
  <svg
    className="size-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

const AddIcon = () => (
  <svg
    className="size-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const ListIcon = () => (
  <svg
    className="size-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
    />
  </svg>
);

const CommentsIcon = () => (
  <svg
    className="size-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="size-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
    />
  </svg>
);

const DraftsIcon = () => (
  <svg
    className="size-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);
