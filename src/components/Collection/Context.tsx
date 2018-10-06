import * as React from "react";
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
  clearRefinement: (name: string) => void;
  changeSortBy: (sortBy: SortByOption) => void;
}

export interface IFacetsByName {
  [name: string]: Array<ILabel>;
}

export interface ILabel {
  value: string;
  count: number;
  isRefined: boolean;
}

export interface ICollectionState {
  sortBy: SortByOption;
  refinements: IRefinementMap;
}

export enum SortByOption {
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

interface IRefinementMap {
  [name: string]: Refinement;
}

export type Refinement = IRefinementList;

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

export const sortByOptions = {
  MANUAL: { key: "MANUAL", reverse: false },
  BEST_SELLING: { key: "BEST_SELLING", reverse: true },
  LEAST_SELLING: { key: "BEST_SELLING", reverse: false },
  TITLE_ASCENDING: { key: "TITLE", reverse: true },
  TITLE_DESCENDING: { key: "TITLE", reverse: false },
  PRICE_ASCENDING: { key: "PRICE", reverse: false },
  PRICE_DESCENDING: { key: "PRICE", reverse: true },
  NEWEST_FIRST: { key: "CREATED", reverse: true },
  OLDEST_FIRST: { key: "CREATED", reverse: false }
};

const { Consumer, Provider } = createNamedContext(
  "Collection",
  {} as ICollectionContext
);

const CollectionConsumer: React.SFC<{
  children: (context: ICollectionContext) => React.ReactNode;
}> = props => {
  return (
    <Consumer>
      {context => {
        if (!context) {
          throw new Error(
            "Collection consumer must be rendered within the Collection component"
          );
        }
        return props.children(context);
      }}
    </Consumer>
  );
};

export { Provider, CollectionConsumer as Consumer };
