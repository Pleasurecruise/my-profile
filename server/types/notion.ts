export interface NotionTitleProp {
  type: "title";
  title: Array<{ plain_text: string }>;
}

export interface NotionNumberProp {
  type: "number";
  number: number | null;
}

export interface NotionImageBlock {
  type: "image";
  image: {
    type: "file" | "external";
    file?: { url: string };
    external?: { url: string };
  };
}

export type NotionProp = NotionTitleProp | NotionNumberProp | { type: string };
