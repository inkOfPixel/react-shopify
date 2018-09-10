import * as React from "react";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";
import { get } from "lodash";
import { ApolloError } from "apollo-boost";
import { uniq } from "lodash";
import {
  Provider,
  ICollectionState,
  ICollectionContext,
  SortBy,
  Refinement,
  IRange,
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
  /** Shopify collection handle */
  handle: string;
  /** Number of products to be fetched at a time */
  limit?: number;
  /** Get refinement values of a product. You can return either a value or an array of values */
  getValues?: (product: Storefront.IProduct, refinementId: string) => any;
  /** By default it fetches only id and title */
  productFragment?: string;
  /** You can use this to setup the initial state. All the keys are optional */
  initialCollectionState?: Partial<ICollectionState>;
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
    const {
      children,
      handle,
      limit,
      initialCollectionState,
      getValues
    } = this.props;
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
            getValues={getValues}
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
  getValues: (product: Storefront.IProduct, refinementId: string) => any;
}

interface IImplState {
  collectionState: ICollectionState;
}

class CollectionImpl extends React.Component<IImplProps, IImplState> {
  static defaultProps = {
    getValues: () => []
  };

  state = {
    collectionState: this.props.initialCollectionState
  };

  setRefinement = (refinement: Refinement) => {
    throw new Error("Not implemented");
  };

  clearRefinement = (id: string) => {
    throw new Error("Not implemented");
  };

  getProducts = () => {
    const { data } = this.props;
    const productEdges = get(data.shop, "collectionByHandle.products.edges") as
      | Storefront.IProductEdge[]
      | undefined;
    return productEdges ? productEdges.map(edge => edge.node) : [];
  };

  getRefinedProducts = () => {
    const { getValues } = this.props;
    const products = this.getProducts();
    return getRefinedProducts(
      products,
      this.state.collectionState.refinements,
      getValues
    );
  };

  getAllValues = (refinement: Refinement): any[] => {
    const products = this.getProducts();
    const getValuesArray = makeArray(this.props.getValues);
    return uniq(
      products.reduce(
        (values, product) =>
          values.concat(getValuesArray(product, refinement.id)),
        [] as any[]
      )
    );
  };

  getContext = (): ICollectionContext => {
    const { loading, error } = this.props;
    return {
      collectionState: this.state.collectionState,
      loading,
      error,
      getProducts: this.getProducts,
      getRefinedProducts: this.getRefinedProducts,
      setRefinement: this.setRefinement,
      clearRefinement: this.clearRefinement,
      getAllValues: this.getAllValues
    };
  };

  render() {
    return <Provider value={this.getContext()}>{this.props.children}</Provider>;
  }
}

const getRefinedProducts = (
  products: Array<Storefront.IProduct>,
  refinements: Array<Refinement>,
  getValues: (product: Storefront.IProduct, refinementId: string) => any
): Array<Storefront.IProduct> => {
  const getValuesArray = makeArray(getValues);
  return refinements.reduce((refinedProducts, refinement) => {
    switch (refinement.kind) {
      case "list":
        return refinedProducts.filter(product => {
          const productValues = getValuesArray(product, refinement.id);
          const operator = refinement.operator || "or";
          switch (operator) {
            case "or":
              return refinement.values.some(value =>
                productValues.includes(value)
              );
            case "and":
              return refinement.values.every(value =>
                productValues.includes(value)
              );
            default:
              return assertNever(operator);
          }
        });
      case "range":
        return refinedProducts.filter(product => {
          const productValues = getValuesArray(product, refinement.id);
          return productValues.some((value: any) => {
            if (typeof value !== "number") {
              throw new Error(
                `getValues: Returned value is not a number. Can't test a non-number value against a range. See product "${
                  product.id
                }" for refinement ${refinement.id}`
              );
            }
            return (
              value >= refinement.range.min && value <= refinement.range.max
            );
          });
        });
      default:
        return assertNever(refinement);
    }
  }, products);
};

const makeArray = (fn: (...params: any[]) => any) => {
  return (...args: any[]) => {
    const result = fn(...args);
    return Array.isArray(result) ? result : [result];
  };
};
