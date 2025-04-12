export type Line = number;
export type Lines = number;

export const TotalLines = 31;

export const NoLines: Lines = /*                       */ 0b0000000000000000000000000000000;
export const NoLine: Line = /*                         */ 0b0000000000000000000000000000000;

export const FunctionTest: Line = /*                   */ 0b1000000000000000000000000000000;

// ACGN
export const ACGNLine: Line = /*                       */ 0b0000000000100000000000000000000;
export const AnimeLine: Line = /*                      */ 0b0000000001000000000000000000000;
export const ComicLine: Line = /*                      */ 0b0000000010000000000000000000000;
export const GameLine: Line = /*                       */ 0b0000000100000000000000000000000;
export const NovelLine: Line = /*                      */ 0b0000001000000000000000000000000;
export const PictureLine: Line = /*                    */ 0b0000010000000000000000000000000;
export const MusicLine: Line = /*                      */ 0b0000100000000000000000000000000;
export const GalGameLine: Line = /*                    */ 0b0001000000000000000000000000000;

// 日常
export const DailyLine: Line = /*                      */ 0b0000000000000000000010000000000;
export const FoodLine: Line = /*                       */ 0b0000000000000000000100000000000;
export const TravelLine: Line = /*                     */ 0b0000000000000000001000000000000;
export const CookingLine: Line = /*                    */ 0b0000000000000000010000000000000;
export const ThoughtLine: Line = /*                    */ 0b0000000000000000100000000000000;

// 技术
export const TechLine: Line = /*                       */ 0b0000000000000000000000000000001;
export const FrontEndLine: Line = /*                   */ 0b0000000000000000000000000000010;
export const ReactLine: Line = /*                      */ 0b0000000000000000000000000000100;
export const WebsiteLine: Line = /*                    */ 0b0000000000000000000000000001000;
export const PerformanceLine: Line = /*                */ 0b0000000000000000000000000010000;
export const StyleLine: Line = /*                      */ 0b0000000000000000000000000100000;

export function getLabelForLine(line: Line): string | void {
  if(line & NoLine ) {
    return "空";
  }
  if (line & ACGNLine) {
    return "二次元";
  }
  if (line & AnimeLine) {
    return "动画";
  }
  if (line & ComicLine) {
    return "漫画";
  }
  if (line & GameLine) {
    return "游戏";
  }
  if (line & NovelLine) {
    return "轻小说";
  }
  if (line & PictureLine) {
    return "插画";
  }
  if (line & MusicLine) {
    return "音乐";
  }
  if (line & GalGameLine) {
    return "galgame";
  }
  if (line & DailyLine) {
    return "日常";
  }
  if (line & FoodLine) {
    return "美食";
  }
  if (line & TravelLine) {
    return "旅行";
  }
  if (line & CookingLine) {
    return "烹饪";
  }
  if (line & ThoughtLine) {
    return "思考";
  }
  if (line & TechLine) {
    return "技术";
  }
  if (line & FrontEndLine) {
    return "前端";
  }
  if (line & ReactLine) {
    return "React";
  }
  if (line & WebsiteLine) {
    return "网站";
  }
  if (line & PerformanceLine) {
    return "性能";
  }
  if (line & StyleLine) {
    return "样式";
  }
  if (line & FunctionTest) {
    return "功能测试";
  }
}

export function mergeLines(line1: Lines, line2: Lines): Lines {
  return line1 | line2;
}

export function removeLine(line: Lines, lineToRemove: Line): Lines {
  return line & ~lineToRemove;
}

export function includeSomeLine(a: Line | Lines, b: Line | Lines): boolean {
  return (a & b) !== NoLines;
}

