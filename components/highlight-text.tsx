import { getHighlightParts } from "@/lib/utils";

interface HighlightTextProps {
  text: string;
  query?: string;
  className?: string;
}

/** 搜索关键词高亮文本 */
export function HighlightText({ text, query, className }: HighlightTextProps) {
  if (!query?.trim()) {
    return <span className={className}>{text}</span>;
  }

  const parts = getHighlightParts(text, query);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark key={i} className="search-highlight">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}
