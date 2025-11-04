/**
 * @file 模式 E - 3D翻页阅读组件
 * 基于分页结果：content 是每页字符串
 * 支持鼠标拖动和触摸拖动页角翻页，实时角度反馈与阈值判定
 */

import React, { useEffect, useRef, useState } from "react";
import "../Reader/styles.css";

/**
 * 3D 翻页（基于分页结果：content 是每页字符串）
 * 支持鼠标拖动和触摸拖动页角翻页，实时角度反馈与阈值判定
 */
interface Reader3DProps {
  content: string[]; // array of pages (strings)
}

const Reader3D: React.FC<Reader3DProps> = ({ content }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const startX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  console.log("Reader3D render", { content, pageIndex, rotation, dragging });

  useEffect(() => {
    // clamp pageIndex
    if (pageIndex < 0) setPageIndex(0);
    if (pageIndex >= content.length) setPageIndex(content.length - 1);
  }, [pageIndex, content.length]);

  // start drag (mouse or touch)
  const handlePointerStart = (clientX: number) => {
    startX.current = clientX;
    setDragging(true);
    setRotation(0);
  };

  const handlePointerMove = (clientX: number) => {
    if (!dragging || startX.current === null) return;
    const delta = clientX - startX.current;
    // map delta to rotation degrees (-180..180)
    const deg = Math.max(-180, Math.min(180, -delta / 2)); // negative -> next page
    setRotation(deg);
  };

  const handlePointerEnd = () => {
    if (!dragging) return;
    const threshold = 40; // px threshold to turn
    // rotation negative means dragging left (go next)
    if (rotation < -20 && pageIndex < content.length - 1) {
      setPageIndex((p) => p + 1);
    } else if (rotation > 20 && pageIndex > 0) {
      setPageIndex((p) => p - 1);
    }
    // reset
    setDragging(false);
    setRotation(0);
    startX.current = null;
  };

  // mouse handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) handlePointerMove(e.clientX);
    };
    const handleMouseUp = () => handlePointerEnd();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, rotation]);

  // touch handlers
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      handlePointerMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => handlePointerEnd();
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, rotation]);

  // pointer down handlers on container
  const onMouseDown = (e: React.MouseEvent) => {
    handlePointerStart(e.clientX);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    handlePointerStart(e.touches[0].clientX);
  };

  // compute transform: when dragging use rotation; otherwise show stable rotation for current page (0)
  const transformStyle = {
    transform: `translateX(-50%) rotateY(${dragging ? rotation : 0}deg)`,
    transition: dragging ? "none" : "transform 600ms cubic-bezier(.2,.8,.2,1)"
  };

  return (
    <div className="reader3d" ref={containerRef} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
      <div className="page3d" style={transformStyle}>
        <div className="page-content">{content[pageIndex] || "（无内容）"}</div>
      </div>
      <div className="page-index">{`${pageIndex + 1}/${content.length}`}</div>
    </div>
  );
};

export default Reader3D;



// import React, { useState, useRef } from "react";
// import "./styles.css";

// export const Reader3D: React.FC<{ content: string[] }> = ({ content }) => {
//   const [page, setPage] = useState(0);
//   const [drag, setDrag] = useState({ active: false, startX: 0, rotation: 0 });
//   const total = content.length;
//   const containerRef = useRef<HTMLDivElement>(null);

//   const onStart = (e: React.MouseEvent | React.TouchEvent) => {
//     const x = "touches" in e ? e.touches[0].clientX : e.clientX;
//     setDrag({ active: true, startX: x, rotation: 0 });
//   };

//   const onMove = (e: React.MouseEvent | React.TouchEvent) => {
//     if (!drag.active) return;
//     const x = "touches" in e ? e.touches[0].clientX : e.clientX;
//     const delta = x - drag.startX;
//     const rotation = Math.max(-180, Math.min(180, delta / 3));
//     setDrag((d) => ({ ...d, rotation }));
//   };

//   const onEnd = () => {
//     if (!drag.active) return;
//     const turn = drag.rotation < -60 ? 1 : drag.rotation > 60 ? -1 : 0;
//     setPage((p) => Math.min(Math.max(p + turn, 0), total - 1));
//     setDrag({ active: false, startX: 0, rotation: 0 });
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="reader3d"
//       onMouseDown={onStart}
//       onMouseMove={onMove}
//       onMouseUp={onEnd}
//       onTouchStart={onStart}
//       onTouchMove={onMove}
//       onTouchEnd={onEnd}
//     >
//       <div
//         className="page3d"
//         style={{
//           transform: `rotateY(${drag.rotation}deg)`,
//           transition: drag.active ? "none" : "transform 0.6s ease",
//         }}
//       >
//         <div className="page-content">{content[page]}</div>
//       </div>
//       <div className="page-index">{`${page + 1}/${total}`}</div>
//     </div>
//   );
// };
