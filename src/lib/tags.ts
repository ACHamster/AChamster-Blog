import {
  Line,
  ACGNLine,
  AnimeLine,
  ComicLine,
  GameLine,
  NovelLine,
  PictureLine,
  MusicLine,
  GalGameLine,
  DailyLine,
  FoodLine,
  TravelLine,
  CookingLine,
  ThoughtLine,
  TechLine,
  FrontEndLine,
  ReactLine,
  WebsiteLine,
  PerformanceLine,
  StyleLine,
  FunctionTest
} from './quick-tag-by-lines';

export interface Tag {
  label: string;
  line: Line;
}

// ACGN 标签组
export const acgnTags: Tag[] = [
  { label: '二次元', line: ACGNLine },
  { label: '动画', line: AnimeLine },
  { label: '漫画', line: ComicLine },
  { label: '游戏', line: GameLine },
  { label: '轻小说', line: NovelLine },
  { label: '插画', line: PictureLine },
  { label: '音乐', line: MusicLine },
  { label: 'galgame', line: GalGameLine },
];

// 日常标签组
export const dailyTags: Tag[] = [
  { label: '日常', line: DailyLine },
  { label: '美食', line: FoodLine },
  { label: '旅行', line: TravelLine },
  { label: '烹饪', line: CookingLine },
  { label: '思考', line: ThoughtLine },
];

// 技术标签组
export const techTags: Tag[] = [
  { label: '技术', line: TechLine },
  { label: '前端', line: FrontEndLine },
  { label: 'React', line: ReactLine },
  { label: '网站', line: WebsiteLine },
  { label: '性能', line: PerformanceLine },
  { label: '样式', line: StyleLine },
];

// 其他标签组
export const otherTags: Tag[] = [
  { label: '功能测试', line: FunctionTest },
];

// 所有标签
export const allTags: Tag[] = [
  ...acgnTags,
  ...dailyTags,
  ...techTags,
  ...otherTags,
];

// 使用 Map 存储标签数据，提高查询效率
export const tagsByLine: Map<Line, Tag> = new Map(
  allTags.map(tag => [tag.line, tag])
);

export const tagsByLabel: Map<string, Tag> = new Map(
  allTags.map(tag => [tag.label, tag])
);

// 根据 line 获取标签 - O(1) 时间复杂度
export function getTagByLine(line: Line): Tag | undefined {
  return tagsByLine.get(line);
}

// 根据 label 获取标签 - O(1) 时间复杂度
export function getTagByLabel(label: string): Tag | undefined {
  return tagsByLabel.get(label);
}
