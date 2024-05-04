import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type MarkDownContent = {
  content: string,
  data: {
    image?: string | undefined,
    title?: string | undefined,
    date?: string | undefined,
    categories?: string[] | undefined,
    tags?: string[] | undefined,
    peek?: string | undefined, /* First line of blog */
    url: string
  }
}
