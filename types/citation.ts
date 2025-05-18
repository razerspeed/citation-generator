// CSL (Citation Style Language) data types
type CSLDateParts = Array<
  [number] | [number, number] | [number, number, number]
>;

export interface CSLDate {
  "date-parts": CSLDateParts;
  season?: number;
  circa?: boolean;
  literal?: string;
  raw?: string;
}

export interface CSLData {
  // Core fields
  type: "book" | "journal" | "webpage" | string;
  id?: string;
  title: string;
  author?:
    | Array<{
        family?: string;
        given?: string;
        literal?: string;
      }>
    | string[];

  // Publication fields
  "container-title"?: string; // Journal or website name
  publisher?: string;
  "publisher-place"?: string;
  volume?: string;
  issue?: string;
  page?: string;
  DOI?: string;
  URL?: string;
  ISBN?: string;

  // Date fields
  issued?: CSLDate;
  accessed?: CSLDate;

  // Additional fields
  edition?: string;
  medium?: string;
  source?: string;
  language?: string;
  "number-of-pages"?: string;

  // Additional metadata
  note?: string;
  abstract?: string;
  keyword?: string;
}
