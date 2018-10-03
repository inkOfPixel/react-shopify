import { ApolloError } from "apollo-boost";
import { createNamedContext } from "../../utils";

export interface ICollectionContext {
  collectionState: ICollectionState;
  loading: boolean;
  error: ApolloError | undefined;
  products: Array<Storefront.IProduct>;
  refinedIds: null | Array<string>;
  facets: IFacetsByName;
  setRefinement: (refinement: Refinement) => void;
  clearRefinement: (name: string, kind: string) => void;
}

export interface IFacetsByName {
  [name: string]: Array<ILabel>;
}

interface ILabel {
  value: string;
  count: number;
  isRefined: boolean;
}

export interface ICollectionState {
  sortBy: SortBy;
  refinements: Array<Refinement>;
}

export interface IRefinementList {
  kind: "list";
  name: string;
  labels: string[];
  operator?: "or" | "and";
}

export interface IRefinementRange {
  kind: "range";
  name: string;
  range: IRange;
}

export interface IRange {
  min: number;
  max: number;
}

export type Refinement = IRefinementList;

export enum SortBy {
  Manual = "MANUAL",
  BestSelling = "BEST_SELLING",
  LeastSelling = "LEAST_SELLING",
  TitleAscending = "TITLE_ASCENDING",
  TitleDescending = "TITLE_DESCENDING",
  PriceAscending = "PRICE_ASCENDING",
  PriceDescending = "PRICE_DESCENDING",
  NewestFirst = "NEWEST_FIRST",
  OldestFirst = "OLDEST_FIRST"
}

const { Provider, Consumer } = createNamedContext(
  "Collection",
  {} as ICollectionContext
);

export { Provider, Consumer };
