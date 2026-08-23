import React from "react";
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

/**
 * 콜아웃 마커. 본문에서 `> [!핵심] ...` 형태로 쓴다.
 * 마커가 없는 인용문은 기존대로 pull quote로 렌더한다.
 */
const CALLOUTS = {
  핵심: { label: "핵심", tone: "key" },
  주의: { label: "주의", tone: "warn" },
  체크: { label: "지금 확인할 것", tone: "check" },
  수치: { label: "숫자로 보기", tone: "stat" },
} as const;

type CalloutKey = keyof typeof CALLOUTS;

const MARKER = /^\s*\[!(핵심|주의|체크|수치)\]\s*/;

/** 첫 텍스트 노드에서 마커 문자열만 제거한다. */
function stripMarker(
  node: React.ReactNode,
  state: { done: boolean },
): React.ReactNode {
  if (state.done) return node;

  if (typeof node === "string") {
    if (!MARKER.test(node)) return node;
    state.done = true;
    return node.replace(MARKER, "");
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>{stripMarker(child, state)}</React.Fragment>
    ));
  }

  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    if (props.children === undefined) return node;
    return React.cloneElement(
      node as React.ReactElement<{ children?: React.ReactNode }>,
      undefined,
      stripMarker(props.children, state),
    );
  }

  return node;
}

/** 정리/요약 성격의 섹션은 시각적으로 따로 닫아 준다. */
const CLOSING_HEADINGS = /^(정리|요약|결론|마무리)/;

const components: MDXComponents = {
  h2: ({ children }) => {
    const text = textFromChildren(children);
    return (
      <h2
        id={slugify(text)}
        data-closing={CLOSING_HEADINGS.test(text.trim()) ? "" : undefined}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => (
    <h3 id={slugify(textFromChildren(children))}>{children}</h3>
  ),
  blockquote: ({ children }) => {
    const marker = MARKER.exec(textFromChildren(children));
    if (!marker) {
      return <blockquote className="pull-quote">{children}</blockquote>;
    }
    const kind = CALLOUTS[marker[1] as CalloutKey];
    return (
      <aside className="callout" data-tone={kind.tone}>
        <p className="callout-label eyebrow">{kind.label}</p>
        <div className="callout-body">
          {stripMarker(children, { done: false })}
        </div>
      </aside>
    );
  },
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
  img: ({ src, alt }) => {
    const raw = String(src ?? "");
    const blobId = raw.startsWith("blob:") ? raw.slice("blob:".length) : "";
    const imageSrc = blobId ? `/api/blobs/${blobId}` : raw;
    return (
      <figure className="paper-figure">
        <img src={imageSrc} alt={alt ?? ""} />
        {alt ? <figcaption>{alt}</figcaption> : null}
      </figure>
    );
  },
};

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
