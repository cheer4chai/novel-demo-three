import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Select, Space } from "antd";
import ReaderScroll from "../components/Reader/ReaderScroll";
import ReaderPaged from "../components/Reader/ReaderPaged";
import Reader3D from "../components/Reader/Reader3D-1";
import { useReaderStore } from "../components/Reader/useReaderStore";
import { ThemeSwitcher } from "../components/Reader/ThemeSwitcher";

const { Option } = Select;

export default function ReaderPage() {
  const { bookId } = useParams();
  const [chapters, setChapters] = useState<any[]>([]);
  const mode = useReaderStore((s) => s.mode);
  const setMode = useReaderStore((s) => s.setMode);
  const theme = useReaderStore((s) => s.theme);

  useEffect(() => {
    // load chapters for bookId
    axios.get(`http://localhost:3001/chapters?bookId=${bookId}`).then((res) => {
      setChapters(res.data || []);
    });
  }, [bookId]);

  // apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Select value={mode} onChange={(v) => setMode(v)} style={{ width: 160 }}>
          <Option value="A">模式 A（连续滚动）</Option>
          <Option value="B">模式 B（分页横滑）</Option>
          <Option value="E">模式 E（3D 翻页）</Option>
        </Select>

        <ThemeSwitcher />
      </Space>

      <div className="reader-shell">
        {mode === "A" && <ReaderScroll chapters={chapters} />}
        {mode === "B" && <ReaderPaged chapters={chapters} />}
        {/* {mode === "B" && <ReaderPaged chapter={chapters[0]} />} */}
        {mode === "E" && (
        //   <Reader3D
        //     content={chapters.map((c) => c.segments.map((s: any) => s.text).join("\n\n"))}
        //   />
            <Reader3D chapters={chapters}/>
        )}
      </div>
    </div>
  );
}
