import { ApolloError } from "apollo-boost";
import { createNamedContext } from "../../utils";

export interface ICollectionContext {
  collectionState: ICollectionState;
  loading: boolean;
  error: ApolloError | undefined;
  getProducts: () => Array<Storefront.IProduct>;
  getRefinedProducts: () => Array<Storefront.IProduct>;
  setRefinement: (refinement: Refinement) => void;
  clearRefinement: (id: string) => void;
  getAllValues: (refinement: Refinement) => any[];
}

export interface IRefinementList {
  kind: "list";
  id: string;
  values: any[];
  operator?: "or" | "and";
}

export interface IRefinementRange {
  kind: "range";
  id: string;
  range: IRange;
}

export interface IRange {
  min: number;
  max: number;
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

const { Provider, Consumer } = createNamedContext(
  "Collection",
  {} as ICollectionContext
);

export { Provider, Consumer };
