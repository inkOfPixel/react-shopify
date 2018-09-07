import * as React from "react";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";
import { get } from "lodash";
import { ApolloError } from "apollo-boost";
import {
  Provider,
  ICollectionState,
  ICollectionContext,
  SortBy,
  Refinement,
  IRefinementList,
  IRefinementRange
} from "./Context";
import { assertNever } from "../../utils";

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

interface QueryVariables {
  handle: string;
  limit: number;
  sortKey: string;
  reverse: boolean;
}

interface IProps {
  children: React.ReactNode;
  /** You can use this to setup the initial state. All the keys are optional */
  initialCollectionState?: Partial<ICollectionState>;
  /** Shopify collection handle */
  handle: string;
  /** Number of products to be fetched at a time */
  limit?: number;
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
    },
    limit: 20
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
                  id
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
    const { children, handle, limit, initialCollectionState } = this.props;
    const { key, reverse } = Collection.sortByOptions[
      (initialCollectionState as ICollectionState).sortBy
    ];
    return (
      <Query
        query={this.state.query}
        variables={{ handle, limit, sortKey: key, reverse } as QueryVariables}
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

  setRefinement = (refinement: Refinement) => {
    throw new Error("Not implemented");
  };

  clearRefinement = (kind: string, attribute: string) => {
    throw new Error("Not implemented");
  };

  getContext = (): ICollectionContext => {
    const { data, loading, error } = this.props;
    const productEdges = get(data.shop, "collectionByHandle.products.edges") as
      | Storefront.IProductEdge[]
      | undefined;
    return {
      collectionState: this.state.collectionState,
      products: productEdges ? productEdges.map(edge => edge.node) : [],
      loading,
      error,
      setRefinement: this.setRefinement,
      clearRefinement: this.clearRefinement
    };
  };

  render() {
    return <Provider value={this.getContext()}>{this.props.children}</Provider>;
  }
}

const getRefinedProducts = (
  products: Array<Storefront.IProduct>,
  refinements: Array<Refinement>,
  index = 0
): Array<Storefront.IProduct> => {
  if (index < refinements.length && products.length > 0) {
    const refinement = refinements[index];
    switch (refinement.kind) {
      case "list":
        return getRefinedProducts(
          applyRefinementList(products, refinement),
          refinements,
          index + 1
        );
      case "range":
        return getRefinedProducts(
          applyRefinementRange(products, refinement),
          refinements,
          index + 1
        );
      default:
        return assertNever(refinement);
    }
  }
  return products;
};

const applyRefinementList = (
  products: Array<Storefront.IProduct>,
  refinement: IRefinementList
): Array<Storefront.IProduct> => {
  return products;
};

const applyRefinementRange = (
  products: Array<Storefront.IProduct>,
  refinement: IRefinementRange
): Array<Storefront.IProduct> => {
  throw new Error("Not implemented");
  return products;
};
