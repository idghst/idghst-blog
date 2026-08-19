import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import { slugify } from "@/lib/toc";

function textFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    (children as { props?: { children?: React.ReactNode } }).props
  ) {
    return textFromChildren(
      (children as { props: { children?: React.ReactNode } }).props.children,
    );
  }
  return "";
}

const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 id={slugify(textFromChildren(children))}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 id={slugify(textFromChildren(children))}>{children}</h3>
  ),
  a: ({ href, children }) => {
    const target = String(href ?? "#");
    const external = /^https?:\/\//.test(target);
    if (external) {
      return (
        <a href={target} target="_blank" rel="noopener noreferrer nofollow">
          {children}
        </a>
      );
    }
    return <Link href={target}>{children}</Link>;
  },
};

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
