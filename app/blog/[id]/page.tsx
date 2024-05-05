import { Navbar } from '@/components/navbar';
import { getBlogPostFileNames, renderMDToHtml } from '@/lib/blogUtils';
import { MarkDownContent } from '@/types';


// A fallback for paths which don't exist
export const dynamicParams = true;

/* Get all mardown files present in $PROJECT_ROOT/posts */
export async function generateStaticParams() {
  const filenames = getBlogPostFileNames()
  console.log("Renderin for:", filenames)

  return filenames.map((fname: string) => ({
    id: fname.replace(/\.md$/, '')
  }))
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const blogId = params.id;

  const info: MarkDownContent = renderMDToHtml(blogId)

  return (
    <div className={`markdown-body bg-transparent`}>
      <h1 className='text-4xl'>{info.data.title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: info.content }}
      >
      </div>
    </div >
  )
}
