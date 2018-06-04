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

export type SortBy =
  | "MANUAL"
  | "BEST_SELLING"
  | "LEAST_SELLING"
  | "TITLE_ASCENDING"
  | "TITLE_DESCENDING"
  | "PRICE_ASCENDING"
  | "PRICE_DESCENDING"
  | "NEWEST_FIRST"
  | "OLDEST_FIRST";

export type EnumAttributeValue<T: string | number> = {
  isRefined: boolean,
  value: T,
  count: number,
  refinedCount: number
};

type SingleRefinement = {
  attribute: string,
  type: "single",
  value: string | number | boolean
};

type MultipleRefinement = {
  attribute: string,
  type: "multiple",
  operator: "and" | "or",
  values: Array<string> | Array<number> | Array<boolean>
};

type RangeRefinement = {
  attribute: string,
  type: "range",
  min: number,
  max: number
};

export type Refinement =
  | SingleRefinement
  | MultipleRefinement
  | RangeRefinement;

export type Product = Object;

export type RefinementMap = { [attribute: string]: Refinement };

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
