import * as React from "react";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";
import { get } from "lodash";
import { ApolloError } from "apollo-boost";
import { uniq, union, intersection, map, mapValues, pickBy } from "lodash";
import {
  Provider,
  ICollectionState,
  ICollectionContext,
  SortBy,
  Refinement,
  IFacetsByName,
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

interface IFacet {
  name: string;
  labels: Array<string> | string;
}

interface IProps {
  children: React.ReactNode;
  /** Shopify collection handle */
  handle: string;
  /** Number of products to be fetched at a time */
  limit?: number;
  /** Get refinement values of a product. You can return either a value or an array of values */
  getFacets?: (product: Storefront.IProduct) => Array<IFacet>;
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
  getFacets?: (product: Storefront.IProduct) => Array<IFacet>;
}

interface IImplState {
  collectionState: ICollectionState;
}

interface IFacetsIndex {
  [name: string]: IIdsByLabel;
}

interface IIdsByLabel {
  [label: string]: Array<string>;
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

  getContext = (): ICollectionContext => {
    const { loading, error, getFacets } = this.props;
    const { collectionState } = this.state;
    const products = this.getProducts();
    const index = buildIndex(products, getFacets);
    const refinedIdsByFacet = getRefinedIdsByFacet(
      index,
      collectionState.refinements
    );
    const refinedIds = hasRefinements(collectionState.refinements)
      ? intersection(...map(refinedIdsByFacet))
      : null;
    const facets = getFacetsByName(
      index,
      refinedIdsByFacet,
      collectionState.refinements
    );
    return {
      collectionState,
      loading,
      error,
      products,
      refinedIds,
      facets,
      setRefinement: this.setRefinement,
      clearRefinement: this.clearRefinement
    };
  };

  render() {
    return <Provider value={this.getContext()}>{this.props.children}</Provider>;
  }
}

const hasRefinements = (refinements: Refinement[]): boolean => {
  return refinements.some(refinement => {
    switch (refinement.kind) {
      case "list":
        return refinement.labels.length > 0;
      default:
        return assertNever(refinement);
    }
  });
};

const buildIndex = (
  products: Array<Storefront.IProduct>,
  getFacets?: (product: Storefront.IProduct) => Array<IFacet>
): IFacetsIndex => {
  if (typeof getFacets !== "function") {
    return {};
  }
  return products.reduce(
    (index, product) => {
      const facets = getFacets(product);
      facets.forEach(facet => {
        if (Array.isArray(facet.labels)) {
          facet.labels.forEach(label => {
            index[facet.name] = index[facet.name] || {};
            index[facet.name][label] = index[facet.name][label] || [];
            index[facet.name][label].push(product.id);
          });
        }
      });
      return index;
    },
    {} as IFacetsIndex
  );
};

interface IRefinedIdsByFacet {
  [name: string]: Array<string>;
}

const getRefinedIdsByFacet = (
  index: IFacetsIndex,
  refinements: Array<Refinement>
): IRefinedIdsByFacet => {
  return refinements.reduce(
    (idsByFacet, refinement) => {
      switch (refinement.kind) {
        case "list": {
          const operator = refinement.operator || "or";
          if (refinement.labels.length === 0) {
            return idsByFacet;
          }
          switch (operator) {
            case "or":
              idsByFacet[refinement.name] = union(
                ...refinement.labels.map(label => index[refinement.name][label])
              );
              break;
            case "and":
              idsByFacet[refinement.name] = intersection(
                ...refinement.labels.map(label => index[refinement.name][label])
              );
              break;
            default:
              return assertNever(operator);
          }
          break;
        }
        default:
          return assertNever(refinement);
      }
      return idsByFacet;
    },
    {} as IRefinedIdsByFacet
  );
};

const getFacetsByName = (
  index: IFacetsIndex,
  refinedIdsByFacet: IRefinedIdsByFacet,
  refinements: Array<Refinement>
): IFacetsByName => {
  const refinementByName = refinements.reduce(
    (byName, refinement) => {
      byName[refinement.name] = refinement;
      return byName;
    },
    {} as { [name: string]: Refinement }
  );
  return mapValues(index, (idsByLabel: IIdsByLabel, name: string) => {
    const facetRefinement = refinementByName[name];
    const facetRefinedIds = refinedIdsByFacet[name];
    const otherFacetsIds = intersection(
      ...map(
        pickBy(refinedIdsByFacet, (ids, _name) => {
          return _name !== name;
        })
      )
    );
    if (facetRefinement && facetRefinement.kind !== "list") {
      throw new Error(`Refinement on <${name}> is not a list refinement`);
    }
    const operator =
      facetRefinement && facetRefinement.operator
        ? facetRefinement.operator
        : "or";
    return map(idsByLabel, (ids, label) => {
      let refinedIdsWithLabel;
      if (facetRefinedIds && facetRefinedIds.length > 0) {
        switch (operator) {
          case "or":
            refinedIdsWithLabel = union(ids, facetRefinedIds);
            break;
          case "and":
            refinedIdsWithLabel = intersection(ids, facetRefinedIds);
            break;
          default:
            return assertNever(operator);
        }
      } else {
        refinedIdsWithLabel = ids;
      }
      refinedIdsWithLabel = intersection(refinedIdsWithLabel, otherFacetsIds);
      const isRefined =
        facetRefinement && facetRefinement.labels.includes(label)
          ? true
          : false;
      return { value: label, count: refinedIdsWithLabel.length, isRefined };
    });
  });
};

const makeArray = (fn: (...params: any[]) => any) => {
  return (...args: any[]) => {
    const result = fn(...args);
    return Array.isArray(result) ? result : [result];
  };
};
