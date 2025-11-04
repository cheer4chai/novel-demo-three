/**
 * @file 模式 B - 按容器高度分页 + 左右滑动翻页 + 鼠标/触摸拖动
 */
import React, { useEffect, useRef, useState } from "react";
import "../Reader/styles.css";

interface ReaderPagedProps {
  chapters: any[];
}

const ReaderPaged: React.FC<ReaderPagedProps> = ({ chapters }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const widthRef = useRef(0);

  // 分页逻辑
  useEffect(() => {
    if (!containerRef.current || !chapters?.length) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    widthRef.current = width;

    const fullText = chapters
      .map((ch) => ch.segments.map((s: any) => s.text).join("\n\n"))
      .join("\n\n");

    const measure = document.createElement("div");
    measure.style.position = "absolute";
    measure.style.visibility = "hidden";
    measure.style.width = `${width}px`;
    measure.style.fontSize = "18px";
    measure.style.lineHeight = "1.9";
    measure.style.padding = "1em";
    measure.style.whiteSpace = "pre-wrap";
    measure.style.wordBreak = "break-word";
    measure.style.boxSizing = "border-box";
    document.body.appendChild(measure);

    const resultPages: string[] = [];
    let start = 0;
    let end = Math.min(400, fullText.length);

    while (start < fullText.length) {
      measure.innerText = fullText.slice(start, end);
      while (measure.offsetHeight < height && end < fullText.length) {
        end += 200;
        measure.innerText = fullText.slice(start, end);
      }
      while (measure.offsetHeight > height && end > start + 50) {
        end -= 20;
        measure.innerText = fullText.slice(start, end);
      }
      resultPages.push(fullText.slice(start, end).trim());
      start = end;
      end = start + 400;
    }

    document.body.removeChild(measure);
    setPages(resultPages);
    setCurrent(0);
  }, [chapters]);

  // 翻页逻辑
  const goPage = (next: number) => {
    if (next < 0 || next >= pages.length) return;
    setCurrent(next);
  };

  // 拖动逻辑（鼠标 + 触摸）
  const handleStart = (clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX.current;
    setOffsetX(deltaX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = widthRef.current * 0.2;
    if (offsetX > threshold && current > 0) {
      setCurrent(current - 1);
    } else if (offsetX < -threshold && current < pages.length - 1) {
      setCurrent(current + 1);
    }
    setOffsetX(0);
  };

  return (
    <div
      className="reader-paged"
      ref={containerRef}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {pages.length > 0 ? (
        <div
          className={`paged-slide ${isDragging ? "dragging" : ""}`}
          style={{
            transform: `translateX(calc(${-current * 100}% + ${offsetX}px))`,
            transition: isDragging ? "none" : "transform 0.3s ease",
          }}
        >
          {pages.map((page, i) => (
            <div
              key={i}
              className="paged-content"
              dangerouslySetInnerHTML={{
                __html: page.replace(/\n/g, "<br/>"),
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: 20 }}>正在分页（首次分页可能稍慢）...</div>
      )}

      <div className="paged-controls">
        <button className="btn" onClick={() => goPage(current - 1)} disabled={current === 0}>
          上一页
        </button>
        <div>{pages.length ? `${current + 1} / ${pages.length}` : "0 / 0"}</div>
        <button
          className="btn"
          onClick={() => goPage(current + 1)}
          disabled={current >= pages.length - 1}
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default ReaderPaged;
