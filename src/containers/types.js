// @flow

export type SortKey =
  | "MANUAL"
  | "BEST_SELLING"
  | "TITLE"
  | "PRICE"
  | "CREATED"
  | "COLLECTION_DEFAULT"
  | "ID"
  | "RELEVANCE";

export type RefinementListAttributeItem<T: mixed> = {
  isRefined: boolean,
  value: T,
  refinedCount: number,
  countIfRefined: number
};

type StringNamedTag = {
  name: string,
  type: "string",
  value: string
};

type BooleanNamedTag = {
  name: string,
  type: "boolean",
  value: boolean
};

type NumberNamedTag = {
  name: string,
  type: "number",
  value: number
};

type EncodedNamedTag = {
  name: string,
  type: "encoded",
  value: string
};

export type NamedTag =
  | StringNamedTag
  | BooleanNamedTag
  | NumberNamedTag
  | EncodedNamedTag;
