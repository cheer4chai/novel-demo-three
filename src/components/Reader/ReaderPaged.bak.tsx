/**
 * @file 模式 B - 分页阅读组件
 */
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import "./ReaderPaged.css"; // 包含翻页动画、主题样式
// import "../Reader/styles.css";

// interface Segment {
//   text: string;
// }

// interface Chapter {
//   id: number;
//   title: string;
//   segments: Segment[];
// }

// interface ReaderPagedProps {
//   chapter: Chapter;
//   containerHeight: number;
//   fontSize?: number;
//   lineHeight?: number;
//   theme?: "default" | "paper" | "night";
// }

// const ReaderPaged: React.FC<ReaderPagedProps> = ({
//   chapter,
//   containerHeight = 350,
//   fontSize = 16,
//   lineHeight = 1.5,
//   theme = "default",
// }) => {
//   const [pages, setPages] = useState<string[][]>([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const measureRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const startX = useRef<number | null>(null);
//   const offsetX = useRef<number>(0);
//   const isDragging = useRef(false);

//   // ------------------ 分页逻辑 ------------------
//   const paginate = useCallback(() => {
//     if (!measureRef.current) return;
//     const tempPages: string[][] = [];
//     let current: string[] = [];
//     let currentHeight = 0;
//     const measureDiv = measureRef.current;

//     console.log("分页中...", chapter);

//     chapter.segments.forEach((seg) => {
//       let text = seg.text;
//       // 将段落拆成约 400 字的小段
//       const segPieces = text.match(/.{1,400}/g) || [text];
//       segPieces.forEach((piece) => {
//         measureDiv.innerText = piece;
//         const h = measureDiv.getBoundingClientRect().height;
//         if (currentHeight + h > containerHeight) {
//           if (current.length > 0) tempPages.push(current);
//           current = [piece];
//           currentHeight = h;
//         } else {
//           current.push(piece);
//           currentHeight += h;
//         }
//       });
//     });

//     if (current.length > 0) tempPages.push(current);
//     setPages(tempPages);
//     setCurrentPage(0);
//   }, [chapter, containerHeight]);

//   useEffect(() => {
//     paginate();
//   }, [paginate, theme, fontSize, lineHeight]);

//   // ------------------ 翻页操作 ------------------
//   const nextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
//   };
//   const prevPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 0));
//   };

//   // ------------------ 手势翻页 ------------------
//   const onPointerDown = (e: React.PointerEvent) => {
//     console.log("onPointerDown", e);
//     isDragging.current = true;
//     startX.current = e.clientX;
//     containerRef.current?.setPointerCapture(e.pointerId);
//   };
//   const onPointerMove = (e: React.PointerEvent) => {
//     if (!isDragging.current || startX.current === null) return;
//     offsetX.current = e.clientX - startX.current;
//     if (containerRef.current) {
//       containerRef.current.style.transform = `translateX(${offsetX.current}px)`;
//     }
//   };
//   const onPointerUp = () => {
//     if (!isDragging.current) return;
//     if (offsetX.current > 50) prevPage();
//     else if (offsetX.current < -50) nextPage();
//     if (containerRef.current) {
//       containerRef.current.style.transition = "transform 0.3s";
//       containerRef.current.style.transform = "translateX(0)";
//       setTimeout(() => {
//         if (containerRef.current) containerRef.current.style.transition = "";
//       }, 300);
//     }
//     isDragging.current = false;
//     offsetX.current = 0;
//     startX.current = null;
//   };

//   return (
//     <div
//       className={`reader-container theme-${theme}`}
//       style={{ height: containerHeight, fontSize, lineHeight }}
//       ref={containerRef}
//       onPointerDown={onPointerDown}
//       onPointerMove={onPointerMove}
//       onPointerUp={onPointerUp}
//     >
//       {pages.length > 0 &&
//         pages[currentPage].map((para, idx) => (
//           <p key={idx} className="reader-paragraph">
//             {para}
//           </p>
//         ))}
//       <div className="reader-controls">
//         <button onClick={prevPage} disabled={currentPage === 0}>
//           上一页
//         </button>
//         <span>
//           {currentPage + 1} / {pages.length}
//         </span>
//         <button
//           onClick={nextPage}
//           disabled={currentPage === pages.length - 1}
//         >
//           下一页
//         </button>
//       </div>

//       {/* 隐藏测量容器 */}
//       <div
//         ref={measureRef}
//         style={{
//           position: "absolute",
//           visibility: "hidden",
//           width: "100%",
//           fontSize,
//           lineHeight,
//           whiteSpace: "pre-wrap",
//         }}
//       />
//     </div>
//   );
// };

// export default ReaderPaged;









import React, { useEffect, useRef, useState } from "react";
import "../Reader/styles.css";

interface ReaderPagedProps {
  chapters: any[];
}

const ReaderPaged: React.FC<ReaderPagedProps> = ({ chapters }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 合并所有章节为数组（每项为段落）
    const paragraphs: string[] = [];
    chapters.forEach((ch) =>
      ch.segments.forEach((s: any) => paragraphs.push(s.text))
    );

    // 创建测量 div
    const measure = document.createElement("div");
    measure.style.position = "absolute";
    measure.style.visibility = "hidden";
    measure.style.width = `${width}px`;
    measure.style.fontSize = "18px";
    measure.style.lineHeight = "1.9";
    measure.style.padding = "0";
    document.body.appendChild(measure);

    const resultPages: string[] = [];
    let acc: string[] = [];

    paragraphs.forEach((p) => {
      acc.push(p);
      measure.innerText = acc.join("\n\n");
      if (measure.offsetHeight > height) {
        // remove last
        acc.pop();
        resultPages.push(acc.join("\n\n"));
        acc = [p];
      }
    });

    if (acc.length) resultPages.push(acc.join("\n\n"));

    document.body.removeChild(measure);
    setPages(resultPages);
    setCurrent(0);
  }, [chapters]);

  return (
    <div className="reader-paged" ref={containerRef}>
      {pages.length > 0 ? (
        <div className="paged-content">
          <div dangerouslySetInnerHTML={{ __html: pages[current].replace(/\n/g, "<br/>") }} />
        </div>
      ) : (
        <div style={{ padding: 20 }}>正在分页（首次分页可能稍慢）...</div>
      )}

      <div className="paged-controls">
        <button className="btn" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          上一页
        </button>
        <div>{pages.length ? `${current + 1} / ${pages.length}` : "0 / 0"}</div>
        <button className="btn" onClick={() => setCurrent((c) => Math.min((pages.length - 1), c + 1))} disabled={current >= pages.length - 1}>
          下一页
        </button>
      </div>
    </div>
  );
};

export default ReaderPaged;










// import React, { useEffect, useRef, useState } from "react";
// import "./styles.css";

// interface ReaderPagedProps {
//   chapters: any[];
// }

// export const ReaderPaged: React.FC<ReaderPagedProps> = ({ chapters }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [pages, setPages] = useState<string[][]>([]); // 每章分页
//   const [currentPage, setCurrentPage] = useState(0);
//   const [currentChapter, setCurrentChapter] = useState(0);

//   // 按容器高度分页
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const paginateChapter = (textSegments: string[]) => {
//       const tempPages: string[][] = [];
//       let currentContent: string[] = [];
//       textSegments.forEach(seg => {
//         currentContent.push(seg);
//         const tempDiv = document.createElement("div");
//         tempDiv.style.position = "absolute";
//         tempDiv.style.visibility = "hidden";
//         tempDiv.style.width = containerRef.current!.offsetWidth + "px";
//         tempDiv.style.fontSize = "18px";
//         tempDiv.style.lineHeight = "1.8";
//         tempDiv.innerText = currentContent.join("\n\n");
//         document.body.appendChild(tempDiv);
//         if (tempDiv.offsetHeight > containerRef.current!.offsetHeight) {
//           currentContent.pop();
//           tempPages.push([...currentContent]);
//           currentContent = [seg];
//         }
//         document.body.removeChild(tempDiv);
//       });
//       if (currentContent.length) tempPages.push(currentContent);
//       return tempPages;
//     };

//     const allPages = chapters.flatMap(ch =>
//       paginateChapter(ch.segments.map((s: any) => s.text))
//     );
//     setPages(allPages);
//   }, [chapters]);

//   const nextPage = () => setCurrentPage(p => Math.min(p + 1, pages.length - 1));
//   const prevPage = () => setCurrentPage(p => Math.max(p - 1, 0));

//   return (
//     <div className="reader-paged" ref={containerRef}>
//       {pages.length > 0 && (
//         <div className="paged-content">
//           {pages[currentPage].map((text, idx) => (
//             <p key={idx}>{text}</p>
//           ))}
//         </div>
//       )}
//       <div className="paged-controls">
//         <button onClick={prevPage} disabled={currentPage === 0}>
//           上一页
//         </button>
//         <span>{currentPage + 1}/{pages.length}</span>
//         <button onClick={nextPage} disabled={currentPage === pages.length - 1}>
//           下一页
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ReaderPaged;