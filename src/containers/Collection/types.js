// @flow

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

export type CollectionProduct = Object;

export type CollectionContext = {
  loading: boolean,
  error: ?Error,
  collectionState: CollectionState,
  updateCollectionState: (changes: $Supertype<CollectionState>) => void
};

export type CollectionState = {
  sortBy: SortBy,
  refinementList?: {
    [attribute: string]: RefinementList
  },
  range?: {
    [attribute: string]: Range
  },
  products: ?Array<CollectionProduct>
};

export type RefinementList = {
  operator: "or" | "and",
  values: Array<mixed>
};

export type Range = {
  min?: number,
  max?: number
};
