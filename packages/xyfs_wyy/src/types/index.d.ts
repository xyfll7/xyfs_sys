/* ----------------- 类型定义 ----------------- */
export type VideoItem = {
  id: string | number;
  src: string;
  poster?: string;
  title?: string;
  author?: string;
  avatar?: string;
  likes?: number;
  comments?: number;
  shares?: number;
};