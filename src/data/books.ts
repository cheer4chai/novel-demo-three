export interface Book {
  id: number;
  title: string;
  author: string;
  summary: string;
}

export const books: Book[] = [
  {
    id: 1,
    title: "三体",
    author: "刘慈欣",
    summary: "地球文明与三体文明的命运交织。"
  },
  {
    id: 2,
    title: "雪中悍刀行",
    author: "烽火戏诸侯",
    summary: "一人一马一刀，闯出江湖血路。"
  },
  {
    id: 3,
    title: "斗破苍穹",
    author: "天蚕土豆",
    summary: "废柴逆袭成巅峰斗帝。"
  }
];