import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import Link from "next/link";
import { MarkDownContent } from "@/types";


export default function BlogList({ posts }: { posts: MarkDownContent[] }) {
  return <div className="flex flex-col gap-4">
    {
      posts.map((post, idx) => {
        return <BlogListItem key={idx} metadata={post.data} />
      })
    }
  </div>
}

function BlogListItem({ metadata }: { metadata: any }) {

  const title = metadata['title'] ?? ''
  const date: Date = metadata['date']
  const image = metadata['image']
  const categories = metadata['categories'] ?? []
  const tags = metadata['tags'] ?? []
  const url = metadata['url'] ?? '/'
  const peek = metadata['peek']



  return (
    <Link href={url} className="no-underline">
      <Card isBlurred shadow="lg" className="border-none bg-surface2/60 hover:bg-surface2/80">
        <CardBody className="">
          <div className="flex flex-col md:flex-row justify-between h-full">
            <div className="flex flex-col justify-between h-full items-start">
              <div>
                <p className="font-bold text-xl md:text-2xl text-text">{title}</p>
              </div>
              <div>
                <p className="text-subtext0 font-sans text-ellipsis my-2">{peek}</p>
              </div>
              <div className="mt-auto">
                <p className="text-subtext1 opacity-80 font-mono">{date.toLocaleDateString()}</p>
              </div>
            </div>

            {/*  TODO: Add image
            image &&
            <div className="w-full h-64">
              <img src={image} className="object-cover w-full h-64" />
            </div>
          */}

          </div>
        </CardBody>
      </Card>
    </Link>
  );


}
