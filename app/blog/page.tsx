import { title } from "@/components/primitives";
import BlogList from "./blog-list";
import { getAllBlogPostDetails } from "@/lib/blogUtils";
import { Navbar } from "@/components/navbar";

export default async function BlogPage() {
  const blogPosts = await getAllBlogPostDetails();

  return (
    <div className="pt-8 m-4">
      <h1 className={`mb-12 text-5xl font-bold text-text`}>Blogs</h1>
      <BlogList posts={blogPosts} />
    </div>
  );
}
