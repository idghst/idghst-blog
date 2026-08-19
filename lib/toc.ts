export type TocItem = { id: string; text: string; level: 2 | 3 };

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * MDX 본문에서 h2/h3만 추출해 TOC를 만든다. 코드펜스 내부는 무시한다.
 */
export function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  let inFence = false;
  const seen = new Map<string, number>();

  for (const line of content.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const level = match[1].length === 2 ? 2 : 3;
    const text = match[2].replace(/[*_`]/g, "").trim();
    let id = slugify(text) || "section";
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    items.push({ id, text, level: level as 2 | 3 });
  }

  return items;
}

/**
 * 본문을 대략 중간 지점(문단 경계)에서 둘로 나눈다. 코드펜스는 건너뛴다.
 * 광고 슬롯을 본문 중턱에 넣기 위한 용도.
 */
export function splitAtMiddle(content: string): [string, string] {
  const paras = content.split(/\n\n+/);
  if (paras.length < 4) return [content, ""];

  const target = Math.floor(paras.length / 2);
  let inFence = false;
  let splitIndex = target;

  for (let i = 0; i < paras.length; i++) {
    if (/```/.test(paras[i]) && (paras[i].match(/```/g)?.length ?? 0) % 2 === 1) {
      inFence = !inFence;
    }
    if (i >= target && !inFence) {
      splitIndex = i;
      break;
    }
  }

  const first = paras.slice(0, splitIndex).join("\n\n");
  const second = paras.slice(splitIndex).join("\n\n");
  return [first, second];
}
