import { ApolloError } from "apollo-boost";
import { createNamedContext } from "../../utils";

export interface IRefinementList {
  kind: "list";
  attribute: string;
  values: string;
  operator?: "or" | "and";
}

interface IRange {
  min: number;
  max: number;
}

export interface IRefinementRange {
  kind: "range";
  attribute: string;
  range: IRange;
}

export type Refinement = IRefinementList | IRefinementRange;

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

export interface ICollectionState {
  sortBy: SortBy;
  refinements: Array<Refinement>;
}

export interface ICollectionContext {
  collectionState: ICollectionState;
  products: Array<Storefront.IProduct>;
  getRefinedProducts: () => Array<Storefront.IProduct>;
  loading: boolean;
  error: ApolloError | undefined;
  setRefinement: (refinement: Refinement) => void;
  clearRefinement: (kind: string, attribute: string) => void;
}

const { Provider, Consumer } = createNamedContext(
  "Collection",
  {} as ICollectionContext
);

export { Provider, Consumer };
