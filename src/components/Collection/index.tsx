import * as React from "react";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";
import { ApolloError } from "apollo-boost";
import { get, union, intersection, map, mapValues, pickBy } from "lodash-es";
import {
  Provider,
  Consumer,
  ICollectionContext,
  ICollectionState,
  SortByOption,
  Refinement,
  IFacetsByName,
  sortByOptions
} from "./Context";
import RefinementList from "./RefinementList";
import Products from "./Products";
import SortBy from "./SortBy";
import CurrentRefinements from "./CurrentRefinements";
import ClearAllRefinements from "./ClearAllRefinements";
import { hasRefinements } from "./utils";
import { assertNever } from "../../utils";

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

interface IState {}

const getQuery = ({ productFragment }: { productFragment: any }) => gql`
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
  ${productFragment}
`;

export default class Collection extends React.Component<IProps, IState> {
  static Consumer = Consumer;
  static RefinementList = RefinementList;
  static Products = Products;
  static SortBy = SortBy;
  static CurrentRefinements = CurrentRefinements;
  static ClearAllRefinements = ClearAllRefinements;

  static sortByOptions = sortByOptions;

  static defaultProps = {
    productFragment: gql`
      fragment CollectionProduct on Product {
        id
        title
        tags
      }
    `,
    initialCollectionState: {
      sortBy: SortByOption.Manual,
      refinements: {}
    },
    limit: 20
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
      getFacets,
      productFragment
    } = this.props;
    const { key, reverse } = Collection.sortByOptions[
      (initialCollectionState as ICollectionState).sortBy
    ];
    return (
      <Query
        query={getQuery({ productFragment })}
        variables={{ handle, limit, sortKey: key, reverse } as QueryVariables}
      >
        {({ data, loading, error, refetch }) => (
          <CollectionImpl
            handle={handle}
            initialCollectionState={this.getInitialCollectionState()}
            data={data}
            loading={loading}
            error={error}
            refetch={refetch}
            limit={limit}
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
  handle: string;
  initialCollectionState: ICollectionState;
  data: { shop?: Storefront.IShop };
  loading: boolean;
  error: ApolloError | undefined;
  limit?: number;
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

  clearAll = () => {
    this.setState(currentState => ({
      collectionState: {
        ...currentState.collectionState,
        refinements: {}
      }
    }));
  };

  changeSortBy = (sortBy: SortByOption) => {
    const { handle, limit } = this.props;
    const { key: sortKey, reverse } = Collection.sortByOptions[sortBy];
    this.props.refetch({ handle, limit, sortKey, reverse });
    this.setState(currentState => ({
      collectionState: {
        ...currentState.collectionState,
        sortBy
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
      clearRefinement: this.clearRefinement,
      clearAll: this.clearAll,
      changeSortBy: this.changeSortBy
    };
  };

  render() {
    return <Provider value={this.getContext()}>{this.props.children}</Provider>;
  }
}

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
