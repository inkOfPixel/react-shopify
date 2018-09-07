import * as React from "react";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";
import { createNamedContext } from "../../utils";
import { ApolloError } from "apollo-boost";

// enum SortKey {
//   Manual = "MANUAL",
//   BestSelling = "BEST_SELLING",
//   Title = "TITLE",
//   Price = "PRICE",
//   Created = "CREATED",
//   CollectionDefault = "COLLECTION_DEFAULT",
//   Id = "ID",
//   Relevance = "RELEVANCE"
// }

type Partial<T> = { [P in keyof T]?: T[P] };

enum SortBy {
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

interface IRefinementList {
  kind: "list";
  attribute: string;
  values: string;
}

interface IRefinementRange {
  kind: "range";
  attribute: string;
  range: string;
}

type Refinement = IRefinementList | IRefinementRange;

interface ICollectionState {
  sortBy: SortBy;
  refinements: Array<Refinement>;
}

interface ICollectionContext {
  collectionState: ICollectionState;
  data: {
    shop?: Storefront.IShop;
  };
  loading: boolean;
  error: ApolloError | undefined;
  updateRefinement: (refinement: Refinement) => void;
}

interface QueryVariables {
  handle: string;
  limit: number;
  sortKey: string;
  reverse: boolean;
}

const CollectionContext = createNamedContext(
  "Collection",
  {} as ICollectionContext
);

interface IProps {
  children: React.ReactNode;
  initialCollectionState?: Partial<ICollectionState>;
  handle: string;
  /** By default it fetches only id and title */
  productFragment?: string;
}

interface IState {
  query: string;
}

export default class Collection extends React.Component<IProps, IState> {
  static defaultProps = {
    productFragment: gql`
      fragment CollectionProduct on Product {
        id
        title
      }
    `,
    initialCollectionState: {
      sortBy: SortBy.Manual,
      refinements: []
    }
  };

  static sortByOptions = {
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

  state = {
    query: gql`
      query CollectionQuery(
        $handle: String!
        $sortKey: ProductCollectionSortKeys
        $reverse: Boolean
        $limit: Int!
      ) {
        shop {
          collectionByHandle(handle: $handle) {
            products(first: $limit, sortKey: $sortKey, reverse: $reverse) {
              edges {
                node {
                  ...CollectionProduct
                }
              }
            }
          }
        }
      }
      ${this.props.productFragment}
    `
  };

  getInitialCollectionState = (): ICollectionState => {
    const initialCollectionState = this.props.initialCollectionState as Partial<
      ICollectionState
    >;
    return {
      ...Collection.defaultProps.initialCollectionState,
      ...initialCollectionState
    };
  };

  render() {
    const { children, handle, initialCollectionState } = this.props;
    const { key, reverse } = Collection.sortByOptions[
      (initialCollectionState as ICollectionState).sortBy
    ];
    return (
      <Query
        query={this.state.query}
        variables={
          { handle, limit: 10, sortKey: key, reverse } as QueryVariables
        }
      >
        {({ data, loading, error, refetch }) => (
          <CollectionImpl
            initialCollectionState={this.getInitialCollectionState()}
            data={data}
            loading={loading}
            error={error}
            refetch={refetch}
          >
            {children}
          </CollectionImpl>
        )}
      </Query>
    );
  }
}

interface IImplProps {
  initialCollectionState: ICollectionState;
  data: { shop?: Storefront.IShop };
  loading: boolean;
  error: ApolloError | undefined;
  refetch: QueryResult<Storefront.IQueryRoot, QueryVariables>["refetch"];
}

interface IImplState {
  collectionState: ICollectionState;
}

class CollectionImpl extends React.Component<IImplProps, IImplState> {
  state = {
    collectionState: this.props.initialCollectionState
  };

  updateRefinement = (refinement: Refinement) => {};

  getContext = (): ICollectionContext => {
    const { data, loading, error } = this.props;
    return {
      collectionState: this.state.collectionState,
      data,
      loading,
      error,
      updateRefinement: this.updateRefinement
    };
  };

  render() {
    return (
      <CollectionContext.Provider value={this.getContext()}>
        {this.props.children}
      </CollectionContext.Provider>
    );
  }
}
