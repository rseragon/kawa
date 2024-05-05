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

function constructMarkDownContent(data: matter.GrayMatterFile<string>, renderedContent?: string, blogUrl: string = '/blog'): MarkDownContent {
  // Convert date for sorting
  let date = data.data.date;
  if (!date)
    date = new Date(0)
  else
    date = new Date(data.data.date)

  // Get the first 3 non-whitespace line for blog peek
  let peek = ''
  const lines = data.content.split('\n')
  let count = 0
  for (let line of lines) {
    if (line.trim().length !== 0) {
      peek += line.trim();
      count += 1;
    }
    if (count === 2)
      break;
  }

  return {
    content: renderedContent ?? data.content, // Puhsin in the renderedContent (md->html) else go with normal string content
    data: {
      ...data.data,
      url: blogUrl,
      date: date,
      peek: peek,
    }
  }
}

/* Reads the content of the file and gives some metadata for rendering */
export function getAllBlogPostDetails(): MarkDownContent[] {
  const filenames = getBlogPostFileNames()

  const info: MarkDownContent[] = []

  for (let mdfile of filenames) {
    const filename = postsDirectory + '/' + mdfile;
    const fileContent = fs.readFileSync(filename, 'utf8')
    const matterResult = matter(fileContent)

    /* Link blog url */
    let blogUrl = '/blog/' + mdfile.replace(/\.md$/, '')

    const data = constructMarkDownContent(matterResult, String(matterResult.content), blogUrl)

    info.push(data)
  }

  return info.sort((a, b) => {
    return b.data.date.valueOf() - a.data.date.valueOf()
  })
}

/* Generates the real html file for rendering */
export function renderMDToHtml(blogId: string): MarkDownContent {

  const fileName = postsDirectory + '/' + blogId + '.md'

  if (!fs.existsSync(fileName)) {
    return {
      content: `Path not found: ${blogId}`,
      data: {
        url: '/404',
        date: new Date()
      }
    }
  }

  const fileContent = fs.readFileSync(fileName, 'utf8')

  const matterResult = matter(fileContent)

  const html = remarkProcessor.processSync(matterResult.content)

  let blogUrl = '/blog/' + blogId

  return constructMarkDownContent(matterResult, String(html), blogUrl)

}
