import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkDirective from "remark-directive";
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkDirectiveRehype from 'remark-directive-rehype'

import { h } from 'hastscript'
import { visit } from 'unist-util-visit'

import { remarkAlert } from 'remark-github-blockquote-alert'


import { MarkDownContent } from '@/types';

const postsDirectory = path.join(process.cwd(), 'posts');


//@ts-ignore
const remarkProcessor = unified()
  .use(remarkParse)
  .use(remarkToc, { tight: true, })
  .use(remarkGfm)
  .use(remarkAlert)

  .use(remarkRehype)

  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings)
  .use(rehypeHighlight)
  .use(rehypeStringify)

export const getBlogPostFileNames = () => {
  const filenames = fs.readdirSync(postsDirectory)
  return filenames;
}

export async function getAllBlogPostDetails(): Promise<matter.GrayMatterFile<string>[]> {
  const filenames = getBlogPostFileNames()

  const info: matter.GrayMatterFile<string>[] = []

  for (let mdfile of filenames) {
    const filename = postsDirectory + '/' + mdfile;
    const fileContent = fs.readFileSync(filename, 'utf8')
    const matterResult = matter(fileContent)

    /* Link blog url */
    matterResult.data.url = '/blog/' + mdfile.replace(/\.md$/, '')

    info.push(matterResult)
  }

  console.log(info[2])
  return info
}

export function renderMDToHtml(blogId: string): MarkDownContent {

  const fileName = postsDirectory + '/' + blogId + '.md'

  if (!fs.existsSync(fileName)) {
    return {
      content: `Path not found: ${blogId}`,
      data: {
        url: '/404',
      }
    }
  }

  const fileContent = fs.readFileSync(fileName, 'utf8')

  const matterResult = matter(fileContent)

  const html = remarkProcessor.processSync(matterResult.content)

  return {
    content: String(html),
    data: { ...matterResult.data, url: '/blog/' + blogId }
  }
}
