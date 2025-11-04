/**
 * @file 模式 A - 连续滚动阅读组件
 */
import React from "react";
import "./styles.css";

interface ReaderScrollProps {
  chapters: any[];
}

export const ReaderScroll: React.FC<ReaderScrollProps> = ({ chapters }) => {
  return (
    <div className="reader-scroll">
      {chapters.map((chapter, idx) => (
        <div key={chapter.id} className="chapter">
          <h2>{chapter.title}</h2>
          {chapter.segments.map((seg: any, sidx: number) => (
            <p key={sidx}>{seg.text}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ReaderScroll;