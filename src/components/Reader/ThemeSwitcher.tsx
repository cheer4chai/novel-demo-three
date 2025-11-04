import React from "react";
import { Select } from "antd";
import { useReaderStore } from "./useReaderStore";

const { Option } = Select;

export const ThemeSwitcher: React.FC = () => {
  const theme = useReaderStore((state) => state.theme);
  const setTheme = useReaderStore((state) => state.setTheme);

  React.useEffect(() => {
    const themeLinkId = "reader-theme-style";
    let link = document.getElementById(themeLinkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = themeLinkId;
      link.rel = "stylesheet/less";
      document.head.appendChild(link);
    }
    switch (theme) {
      case "light":
        link.href = "/src/theme/light.less";
        break;
      case "dark":
        link.href = "/src/theme/dark.less";
        break;
      case "paper":
        link.href = "/src/theme/paper.less";
        break;
    }
  }, [theme]);

  return (
    <div style={{ margin: "20px" }}>
      <Select value={theme} onChange={setTheme} style={{ width: 120 }}>
        <Option value="light">Light</Option>
        <Option value="dark">Dark</Option>
        <Option value="paper">Paper</Option>
      </Select>
    </div>
  );
};
