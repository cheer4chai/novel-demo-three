/**
 * @file 模式 E - 3D翻页阅读组件
 */
import React, { useEffect, useRef, useState } from "react";
import "./Reader3D-1.css";

interface Reader3DProps {
  chapters: any[];
}

const Reader3D: React.FC<Reader3DProps> = ({ chapters }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const startX = useRef<number | null>(null);
  const widthRef = useRef(0);

  // ✅ 分页逻辑复用模式 B
  // useEffect(() => {
  //   if (!containerRef.current) return;
  //   const width = containerRef.current.clientWidth;
  //   const height = containerRef.current.clientHeight;

  //   const paragraphs: string[] = [];
  //   chapters.forEach((ch) =>
  //     ch.segments.forEach((s: any) => paragraphs.push(s.text))
  //   );

  //   const measure = document.createElement("div");
  //   measure.style.position = "absolute";
  //   measure.style.visibility = "hidden";
  //   measure.style.width = `${width}px`;
  //   measure.style.fontSize = "18px";
  //   measure.style.lineHeight = "1.8";
  //   measure.style.padding = "16px";
  //   measure.style.boxSizing = "border-box";
  //   document.body.appendChild(measure);

  //   const resultPages: string[] = [];
  //   let acc: string[] = [];

  //   paragraphs.forEach((p) => {
  //     acc.push(p);
  //     measure.innerText = acc.join("\n\n");
  //     if (measure.offsetHeight > height) {
  //       acc.pop();
  //       resultPages.push(acc.join("\n\n"));
  //       acc = [p];
  //     }
  //   });

  //   if (acc.length) resultPages.push(acc.join("\n\n"));
  //   document.body.removeChild(measure);
  //   setPages(resultPages);
  //   setPageIndex(0);
  // }, [chapters]);
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
    setPageIndex(0);
  }, [chapters]);

  // ✅ 拖拽翻页逻辑
  const handlePointerStart = (clientX: number) => {
    startX.current = clientX;
    setDragging(true);
    setRotation(0);
  };

  const handlePointerMove = (clientX: number) => {
    if (!dragging || startX.current === null) return;
    const delta = clientX - startX.current;
    const deg = Math.max(-180, Math.min(180, delta / 2));
    setRotation(deg);
  };

  const handlePointerEnd = () => {
    if (!dragging) return;
    if (rotation < -30 && pageIndex < pages.length - 1) {
      setPageIndex((p) => p + 1);
    } else if (rotation > 30 && pageIndex > 0) {
      setPageIndex((p) => p - 1);
    }
    setDragging(false);
    setRotation(0);
    startX.current = null;
  };

  // 鼠标 + 触摸监听
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => dragging && handlePointerMove(e.clientX);
    const onMouseUp = () => handlePointerEnd();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, rotation]);

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      handlePointerMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handlePointerEnd();
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging, rotation]);

  // 翻页动画
  const transformStyle = {
    transform: `translateX(-50%) rotateY(${dragging ? rotation : 0}deg)`,
    transition: dragging ? "none" : "transform 0.6s cubic-bezier(.25,.8,.25,1)"
  };

  return (
    <div
      className="reader3d"
      ref={containerRef}
      onMouseDown={(e) => handlePointerStart(e.clientX)}
      onTouchStart={(e) => handlePointerStart(e.touches[0].clientX)}
    >
      <div className="book-scene">
        <div className="book-page" style={transformStyle}>
          <div
            className="book-content"
            dangerouslySetInnerHTML={{
              __html: pages[pageIndex]?.replace(/\n/g, "<br/>") || "加载中..."
            }}
          />
        </div>
      </div>

      <div className="reader-controls">
        <button
          className="btn"
          onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
          disabled={pageIndex === 0}
        >
          上一页
        </button>
        <div className="page-index">{`${pageIndex + 1} / ${pages.length}`}</div>
        <button
          className="btn"
          onClick={() => setPageIndex((p) => Math.min(pages.length - 1, p + 1))}
          disabled={pageIndex >= pages.length - 1}
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default Reader3D;
