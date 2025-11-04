# Ant Design 小说阅读器 Demo

## 项目特性
- React + Vite + TypeScript + Ant Design
- 小说阅读三模式：
  - A 模式：连续滚动（ReaderScroll）
  - B 模式：分页阅读（ReaderPaged）
  - E 模式：3D 翻页动画 + 鼠标/触摸拖动（Reader3D）
- 主题支持：
  - Light / Dark / Paper
- Mock 数据：
  - json-server 提供简化版小说数据（3 本书 × 每本 3 章 × 每章 2 段）
- 状态管理：Zustand

---

## 本地运行

1. 安装依赖：
```bash
npm install
```

2. 启动 Mock 数据服务：
```bash
npm run mock
```
默认端口: 3001

3. 启动前端开发服务器：
```bash
npm run dev
```
默认端口: 5173

## Docker 运行
```bash
docker-compose up
```
服务启动后：
- 前端: http://localhost:5173
- Mock: http://localhost:3001


## 使用说明

1. 首页展示小说列表，点击进入阅读页面

2. 阅读页面顶部：

    - 模式选择（A/B/E）

    - 主题切换（Light / Dark / Paper）

3. 阅读器：

    - A 模式：连续滚动章节

    - B 模式：分页翻页，支持上一页/下一页按钮

    - E 模式：3D 翻页动画，可鼠标/触摸拖动页角翻页

4. 支持夜间模式 / 纸质书样式 / 默认亮色模式

5. 阅读进度可通过 Zustand 管理，后续可扩展到本地存储或服务器同步

## 目录结构
```cshrap
novel-reader-antd/
├── mock/
│   ├── db.json                # 简化小说 mock 数据
│   └── server.js              # json-server 启动脚本
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── theme/
│   │   ├── light.less
│   │   ├── dark.less
│   │   └── paper.less
│   ├── components/
│   │   ├── Reader/
│   │   │   ├── Reader.tsx           # 模式选择器（A/B/E）
│   │   │   ├── ReaderScroll.tsx     # 模式 A - 连续滚动
│   │   │   ├── ReaderPaged.tsx      # 模式 B - 分页阅读
│   │   │   ├── Reader3D.tsx         # 模式 E - 3D 翻页（拖动翻页）
│   │   │   ├── useReaderStore.ts    # Zustand 状态管理（进度、主题、模式）
│   │   │   ├── usePagination.ts     # 通用分页 hook
│   │   │   └── styles.css
│   │   ├── ChapterMenu.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── ReaderPage.tsx
│   ├── api/
│   │   ├── client.ts                # axios 实例
│   │   ├── books.ts
│   │   ├── chapters.ts
│   │   └── users.ts
│   └── types/
│       ├── book.ts
│       ├── chapter.ts
│       └── user.ts
├── vite.config.ts
├── package.json
└── README.md
```