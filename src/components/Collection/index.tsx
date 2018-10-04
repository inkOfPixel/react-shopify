import * as React from "react";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";
import { ApolloError } from "apollo-boost";
import { get, union, intersection, map, mapValues, pickBy } from "lodash-es";
import { assertNever } from "../../utils";
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
  sortBy: SortBy;
  refinements: IRefinementMap;
}

interface IRefinementMap {
  [name: string]: Refinement;
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

const CollectionContext = createNamedContext(
  "Collection",
  {} as ICollectionContext
);

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
  getFacets?: ReactShopify.FacetExtractor;
  /** By default it fetches only id and title */
  productFragment?: string;
  /** You can use this to setup the initial state. All the keys are optional */
  initialCollectionState?: Partial<ICollectionState>;
}

interface IState {
  query: string;
}

const CollectionConsumer: React.SFC<{
  children: (context: ICollectionContext) => React.ReactNode;
}> = props => {
  return (
    <CollectionContext.Consumer>
      {context => {
        if (!context) {
          throw new Error(
            "Collection consumer must be rendered within the Collection component"
          );
        }
        return props.children(context);
      }}
    </CollectionContext.Consumer>
  );
};

export default class Collection extends React.Component<IProps, IState> {
  static Consumer = CollectionConsumer;

  static defaultProps = {
    productFragment: gql`
      fragment CollectionProduct on Product {
        id
        title
        tags
      }
    `,
    initialCollectionState: {
      sortBy: SortBy.Manual,
      refinements: {}
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
      getFacets
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
            getFacets={getFacets}
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
  getFacets?: (product: Storefront.IProduct) => Array<ReactShopify.IFacet>;
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
    this.setState(currentState => ({
      collectionState: {
        ...currentState.collectionState,
        refinements: {
          ...currentState.collectionState.refinements,
          [refinement.name]: refinement
        }
      }
    }));
  };

  clearRefinement = (name: string) => {
    this.setState(currentState => ({
      collectionState: {
        ...currentState.collectionState,
        refinements: pickBy(
          currentState.collectionState.refinements,
          (refinement, _name) => {
            return _name !== name;
          }
        )
      }
    }));
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
    const refinements = map(collectionState.refinements);
    const products = this.getProducts();
    const index = buildIndex(products, getFacets);
    let refinedIdsByFacet = {} as IRefinedIdsByFacet;
    let refinedIds = null;
    if (hasRefinements(refinements)) {
      refinedIdsByFacet = getRefinedIdsByFacet(index, refinements);
      refinedIds = intersection(...map(refinedIdsByFacet));
    }
    const facets = getFacetsByName(index, refinedIdsByFacet, refinements);
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
    return (
      <CollectionContext.Provider value={this.getContext()}>
        {this.props.children}
      </CollectionContext.Provider>
    );
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
  getFacets?: (product: Storefront.IProduct) => Array<ReactShopify.IFacet>
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
              console.log("index and ref", index, refinement);
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
    const otherIdsByFacet = pickBy(refinedIdsByFacet, (ids, _name) => {
      return _name !== name;
    });
    const otherFacetsIds =
      Object.keys(otherIdsByFacet).length > 0
        ? intersection(...map(otherIdsByFacet))
        : null;
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
            refinedIdsWithLabel = ids;
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
      if (otherFacetsIds) {
        refinedIdsWithLabel = intersection(refinedIdsWithLabel, otherFacetsIds);
      }
      const isRefined =
        facetRefinement && facetRefinement.labels.includes(label)
          ? true
          : false;
      return { value: label, count: refinedIdsWithLabel.length, isRefined };
    });
  });
};
