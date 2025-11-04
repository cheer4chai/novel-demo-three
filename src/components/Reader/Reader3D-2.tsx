import React, { useEffect, useRef, useState } from "react";
import "./Reader3D-2.css";

interface Reader3DProps {
  chapters: {
    id: number;
    bookId: number;
    title: string;
    segments: { text: string }[];
  }[];
}

const Reader3D: React.FC<Reader3DProps> = ({ chapters }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const startX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ 分页逻辑复用模式B
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 合并所有章节内容
    const paragraphs: string[] = [];
    chapters.forEach((ch) =>
      ch.segments.forEach((s) => paragraphs.push(s.text))
    );

    const measure = document.createElement("div");
    measure.style.position = "absolute";
    measure.style.visibility = "hidden";
    measure.style.width = `${width}px`;
    measure.style.fontSize = "18px";
    measure.style.lineHeight = "1.9";
    measure.style.padding = "0 16px";
    document.body.appendChild(measure);

    const resultPages: string[] = [];
    let acc: string[] = [];

    paragraphs.forEach((p) => {
      acc.push(p);
      measure.innerText = acc.join("\n\n");
      if (measure.offsetHeight > height - 60) {
        acc.pop();
        resultPages.push(acc.join("\n\n"));
        acc = [p];
      }
    });
    if (acc.length) resultPages.push(acc.join("\n\n"));

    document.body.removeChild(measure);
    setPages(resultPages);
  }, [chapters]);

  // ✅ 手势交互逻辑
  const handlePointerStart = (clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
    setRotation(0);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging || startX.current === null) return;
    const delta = clientX - startX.current;
    // 正向翻页（左划 => 下一页）
    const deg = Math.max(-180, Math.min(0, delta / 2));
    setRotation(deg);
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;
    const threshold = 50;
    if (rotation < -30 && pageIndex < pages.length - 1) {
      // 下一页
      setPageIndex((p) => p + 1);
    } else if (rotation > -5 && pageIndex > 0) {
      // 上一页
      setPageIndex((p) => p - 1);
    }
    setIsDragging(false);
    setRotation(0);
    startX.current = null;
  };

  // 鼠标与触摸事件
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX);
    const onMouseUp = () => handlePointerEnd();
    const onTouchMove = (e: TouchEvent) => handlePointerMove(e.touches[0].clientX);
    const onTouchEnd = () => handlePointerEnd();

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, rotation]);

  const onMouseDown = (e: React.MouseEvent) => handlePointerStart(e.clientX);
  const onTouchStart = (e: React.TouchEvent) => handlePointerStart(e.touches[0].clientX);

  // ✅ 计算 transform
  const pageStyle = {
    transform: `rotateY(${rotation}deg)`,
    transition: isDragging ? "none" : "transform 0.6s ease-out",
  };

  return (
    <div
      className="reader3d-container"
      ref={containerRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div className="book">
        {/* 背面（下一页） */}
        {pages[pageIndex + 1] && (
          <div
            className="page back"
            dangerouslySetInnerHTML={{
              __html: pages[pageIndex + 1].replace(/\n/g, "<br/>"),
            }}
          />
        )}

        {/* 当前页（带翻页卷曲） */}
        {pages[pageIndex] && (
          <div
            className={`page front ${isDragging ? "dragging" : ""}`}
            style={pageStyle}
          >
            <div
              className="page-content"
              dangerouslySetInnerHTML={{
                __html: pages[pageIndex].replace(/\n/g, "<br/>"),
              }}
            />
            <div className="page-shadow" />
          </div>
        )}
      </div>

      {/* 控制条 */}
      <div className="reader-controls">
        <button
          onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
          disabled={pageIndex === 0}
        >
          上一页
        </button>
        <span>
          {pageIndex + 1}/{pages.length}
        </span>
        <button
          onClick={() => setPageIndex((p) => Math.min(pages.length - 1, p + 1))}
          disabled={pageIndex === pages.length - 1}
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default Reader3D;
