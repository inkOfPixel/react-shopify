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
  IRefinementMap,
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
import { IFacet, FacetExtractor } from "../../types";

enum StateChangeType {
  updateRefinement = "__update_refinement__",
  updateSortBy = "__update_sort_by__"
}

interface QueryVariables {
  handle: string;
  limit: number;
  sortKey: string;
  reverse: boolean;
}

interface IProps {
  /** Shopify collection handle */
  handle: string;
  /** Number of products to be fetched at a time */
  limit: number;
  /** Get refinement values of a product. You can return either a value or an array of values */
  getFacets?: FacetExtractor;
  /** A graphql fragment returned by gql tag. By default it fetches only id and title */
  productFragment: any;
  /** Set collection initial sort by */
  initialSortBy?: SortByOption;
  /** Control collection sorting */
  sortBy?: SortByOption;
  /** Set collection initial refinements */
  initialRefinements?: IRefinementMap;
  /** Control collection refinements */
  refinements?: IRefinementMap;
  /** Get notified when collection state changes. The changes parameters contains a type that identifies the type of change */
  onStateChange?: <K extends keyof StateWithChangeType>(
    changes: Pick<StateWithChangeType, K>,
    currentState: ICollectionState
  ) => void;
}

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

export default class Collection extends React.Component<IProps, {}> {
  static Consumer = Consumer;
  static RefinementList = RefinementList;
  static Products = Products;
  static SortBy = SortBy;
  static CurrentRefinements = CurrentRefinements;
  static ClearAllRefinements = ClearAllRefinements;

  static sortByOptions = sortByOptions;
  static stateChangeTypes = StateChangeType;

  static defaultProps = {
    productFragment: gql`
      fragment CollectionProduct on Product {
        id
        title
        tags
      }
    `,
    limit: 20
  };

  getInitialSortByOptions() {
    const sortBy =
      this.props.sortBy ||
      this.props.initialSortBy ||
      CollectionImpl.defaultProps.initialSortBy;
    return Collection.sortByOptions[sortBy];
  }

  render() {
    const {
      children,
      handle,
      limit,
      productFragment,
      ...otherProps
    } = this.props;
    const { key, reverse } = this.getInitialSortByOptions();
    return (
      <Query
        query={getQuery({ productFragment })}
        variables={{ handle, limit, sortKey: key, reverse }}
      >
        {({ data, loading, error, refetch }) => (
          <CollectionImpl
            handle={handle}
            data={data}
            loading={loading}
            error={error}
            refetch={refetch}
            limit={limit}
            {...otherProps}
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
  initialSortBy: SortByOption;
  sortBy?: SortByOption;
  initialRefinements: IRefinementMap;
  refinements?: IRefinementMap;
  data: { shop?: Storefront.IShop };
  loading: boolean;
  error: ApolloError | undefined;
  limit?: number;
  refetch: QueryResult<Storefront.IQueryRoot, QueryVariables>["refetch"];
  getFacets?: (product: Storefront.IProduct) => Array<IFacet>;
  onStateChange: <K extends keyof StateWithChangeType>(
    changes: Pick<StateWithChangeType, K>,
    currentState: ICollectionState
  ) => void;
}

interface IFacetsIndex {
  [name: string]: IIdsByLabel;
}

interface IIdsByLabel {
  [label: string]: Array<string>;
}

type StateWithChangeType = ICollectionState & { type: StateChangeType };

class CollectionImpl extends React.Component<IImplProps, ICollectionState> {
  static defaultProps = {
    initialSortBy: SortByOption.Manual,
    initialRefinements: {},
    onStateChange: () => {}
  };

  initialState = {
    sortBy: this.props.initialSortBy,
    refinements: this.props.initialRefinements
  };

  state = this.initialState;

  isControlled(prop: string) {
    // @ts-ignore
    return (this.props[prop] as any) !== undefined;
  }

  getState(state = this.state) {
    return Object.entries(state).reduce(
      (combinedState, [key, value]) => {
        if (this.isControlled(key)) {
          // @ts-ignore
          combinedState[key] = this.props[key];
        } else {
          combinedState[key] = value;
        }
        return combinedState;
      },
      {} as ICollectionState
    );
  }

  internalSetState<K extends keyof StateWithChangeType>(
    changes:
      | ((
          prevState: Readonly<ICollectionState>,
          props: Readonly<IImplProps>
        ) => Pick<StateWithChangeType, K> | StateWithChangeType | null)
      | (Pick<StateWithChangeType, K> | StateWithChangeType | null),
    callback = () => {}
  ) {
    let allChanges: Pick<StateWithChangeType, K>;
    this.setState(
      (state, props) => {
        const combinedState = this.getState(state);
        const changesObject =
          typeof changes === "function"
            ? changes(combinedState, props)
            : changes;

        if (!changesObject) {
          return null;
        }
        allChanges = changesObject;
        const {
          type: ignoredType,
          ...onlyChanges
        } = changesObject as StateWithChangeType;

        const nonControlledChanges = Object.entries(onlyChanges).reduce(
          (newChanges, [key, value]) => {
            if (!this.isControlled(key)) {
              newChanges[key] = value;
            }
            return newChanges;
          },
          {} as Pick<ICollectionState, K>
        );

        return Object.keys(nonControlledChanges).length
          ? nonControlledChanges
          : null;
      },
      () => {
        this.props.onStateChange(allChanges, this.getState());
        callback();
      }
    );
  }

  componentDidUpdate(prevProps: IImplProps, prevState: ICollectionState) {
    if (this.getState().sortBy !== this.getState(prevState).sortBy) {
      const { handle, limit } = this.props;
      const { key: sortKey, reverse } = Collection.sortByOptions[
        this.state.sortBy
      ];
      this.props.refetch({ handle, limit, sortKey, reverse });
    }
  }

  setRefinement = (refinement: Refinement) => {
    if (refinement.labels.length > 0) {
      this.internalSetState(currentState => ({
        type: StateChangeType.updateRefinement,
        refinements: {
          ...currentState.refinements,
          [refinement.name]: refinement
        }
      }));
    } else {
      this.clearRefinement(refinement.name);
    }
  };

  clearRefinement = (name: string) => {
    this.internalSetState(currentState => ({
      type: StateChangeType.updateRefinement,
      refinements: pickBy(
        currentState.refinements,
        (ignoredRefinement, _name) => {
          return _name !== name;
        }
      )
    }));
  };

  clearAll = () => {
    this.internalSetState(currentState => ({
      type: StateChangeType.updateRefinement,
      refinements: {}
    }));
  };

  changeSortBy = (sortBy: SortByOption) => {
    this.internalSetState(currentState => ({
      type: StateChangeType.updateSortBy,
      sortBy
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
    const { refinements, sortBy } = this.getState();
    const refinementsList = map(refinements);
    const products = this.getProducts();
    const index = buildIndex(products, getFacets);
    let refinedIdsByFacet = {} as IRefinedIdsByFacet;
    let refinedIds = null;
    if (hasRefinements(refinementsList)) {
      refinedIdsByFacet = getRefinedIdsByFacet(index, refinementsList);
      refinedIds = intersection(...map(refinedIdsByFacet));
    }
    const facets = getFacetsByName(index, refinedIdsByFacet, refinementsList);
    return {
      refinements,
      sortBy,
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
          // @ts-ignore
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
