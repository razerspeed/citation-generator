export interface Style {
  id: string;
  name: string;
  filename: string;
}

export interface FuseResultItem {
  item: Style;
  refIndex: number;
  score?: number;
}
