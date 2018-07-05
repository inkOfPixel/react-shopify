// @flow

import React, { type Node } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import isEqual from "lodash/isEqual";
import { Provider } from "./Context";
import { sortByOptions, getProducts } from "./utils";
import type {
  CollectionProduct,
  CollectionState,
  CollectionContext,
  SortBy,
  RefinementList,
  Range
} from "./types";

type CollectionStateProp = {
  sortBy?: SortBy,
  refinementList?: {
    [attribute: string]: RefinementList
  },
  range?: {
    [attribute: string]: Range
  },
  products: ?Array<CollectionProduct>
};

type Props = {
  children: Node,
  /** Collection state */
  collectionState?: CollectionStateProp,
  /** Called when the collection state changes */
  onCollectionStateChange?: CollectionState => void,
  /** Default collection sort by: `MANUAL`, `BEST_SELLING`, `LEAST_SELLING`, `TITLE_ASCENDING`, `TITLE_DESCENDING`, `PRICE_ASCENDING`, `PRICE_DESCENDING`, `NEWEST_FIRST`, `OLDEST_FIRST`; */
  defaultSortBy: SortBy,
  /** Shopify collection handle */
  handle: string,
  /** Limit the number of fetched products (Max 250)*/
  limit: number,
  /** Image options */
  imageOptions?: {
    maxWidth?: number,
    maxHeight?: number,
    crop?: "CENTER" | "TOP" | "BOTTOM" | "LEFT" | "RIGHT",
    scale?: number
  }
};

type WrappedState = {
  collectionState: CollectionState
};

type WrappedProps = {
  children: Node,
  collectionState?: CollectionState,
  onCollectionStateChange: CollectionState => void,
  defaultSortBy: SortBy,
  handle: string,
  query: {
    data: Object,
    loading: boolean,
    error: ?Error,
    refetch: (variables?: Object) => void
  }
};

class CollectionProvider extends React.Component<WrappedProps, WrappedState> {
  static defaultProps = {
    onCollectionStateChange: () => {}
  };

  constructor(props: WrappedProps) {
    super(props);
    const products = getProducts(props.query.data);
    this.state = {
      collectionState: {
        sortBy: this.props.defaultSortBy,
        products,
        ...this.props.collectionState
      }
    };
  }

  componentDidUpdate(previousProps: WrappedProps, previousState: WrappedState) {
    let collectionStateChanges: $Supertype<
      $PropertyType<WrappedState, "collectionState">
    > = {};
    const combinedState = this.getState();
    const combinedPreviousState = this.getState(previousState);

    if (this.isControlled("collectionState")) {
      const { query } = this.props;
      if (query.data !== previousProps.query.data) {
        const products = getProducts(query.data);
        if (!isEqual(products, combinedState.collectionState.products)) {
          collectionStateChanges.products = products;
        }
      }

      this.props.onCollectionStateChange({
        ...combinedState.collectionState,
        collectionStateChanges
      });
    } else {
      this.setState((currentState: WrappedState, props: WrappedProps) => {
        const currentCombinedState = this.getState(currentState);
        const { query } = props;
        if (query.data !== previousProps.query.data) {
          const products = getProducts(query.data);
          if (
            !isEqual(products, currentCombinedState.collectionState.products)
          ) {
            collectionStateChanges.products = products;
          }
        }
        if (Object.keys(collectionStateChanges).length > 0) {
          return {
            collectionState: {
              ...currentCombinedState.collectionState,
              ...collectionStateChanges
            }
          };
        }
        return null;
      });
    }

    const { sortBy } = combinedState.collectionState;
    if (sortBy !== combinedPreviousState.collectionState.sortBy) {
      const { query, handle } = this.props;
      query.refetch({
        handle,
        sortKey: sortByOptions[sortBy].key,
        reverse: sortByOptions[sortBy].reverse
      });
    }
  }

  updateCollectionState = (changes: $Supertype<CollectionState>) => {
    if (this.isControlled("collectionState")) {
      const { collectionState } = this.getState();
      this.props.onCollectionStateChange({
        ...collectionState,
        ...changes
      });
    } else {
      this.setState(
        currentState => {
          const { collectionState } = this.getState(currentState);
          return {
            collectionState: {
              ...collectionState,
              changes
            }
          };
        },
        () => {
          this.props.onCollectionStateChange(this.state.collectionState);
        }
      );
    }
  };

  isControlled = (prop: string): boolean => {
    return this.props[prop] !== undefined;
  };

  getState = (
    state: WrappedState = this.state,
    props: WrappedProps = this.props
  ): WrappedState => {
    const stateCopy = { ...state };
    return Object.entries(state).reduce((combinedState, [key, value]) => {
      if (this.isControlled(key)) {
        combinedState[key] = props[key];
      }
      return combinedState;
    }, stateCopy);
  };

  getContext = (): CollectionContext => {
    const state = this.getState();
    return {
      loading: this.props.query.loading,
      error: this.props.query.error,
      collectionState: state.collectionState,
      updateCollectionState: this.updateCollectionState
    };
  };

  render() {
    const { children } = this.props;
    return <Provider value={this.getContext()}>{children}</Provider>;
  }
}

export default class Collection extends React.PureComponent<Props> {
  static query = gql`
    query CollectionQuery(
      $handle: String!
      $sortKey: ProductCollectionSortKeys
      $reverse: Boolean
      $limit: Int!
      $imageMaxWidth: Int
      $imageMaxHeight: Int
      $imageCrop: CropRegion
      $imageScale: Int
    ) {
      shop {
        collectionByHandle(handle: $handle) {
          products(first: $limit, sortKey: $sortKey, reverse: $reverse) {
            edges {
              node {
                availableForSale
                id
                title
                description
                descriptionHtml
                handle
                tags
                vendor
                priceRange {
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                productType
                publishedAt
                variants(first: 250) {
                  edges {
                    node {
                      id
                      availableForSale
                      compareAtPrice
                      price
                      title
                      image {
                        id
                        altText
                        transformedSrc(
                          maxWidth: $imageMaxWidth
                          maxHeight: $imageMaxHeight
                          crop: $imageCrop
                          scale: $imageScale
                        )
                      }
                      selectedOptions {
                        name
                        value
                      }
                      sku
                      title
                    }
                  }
                }
                images(first: 10) {
                  edges {
                    node {
                      altText
                      id
                      transformedSrc(
                        maxWidth: $imageMaxWidth
                        maxHeight: $imageMaxHeight
                        crop: $imageCrop
                        scale: $imageScale
                      )
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  static defaultProps = {
    handle: "all",
    defaultSortBy: "BEST_SELLING",
    limit: 250
  };

  getSortBy = (): SortBy => {
    const { collectionState, defaultSortBy } = this.props;
    return collectionState && collectionState.sortBy
      ? collectionState.sortBy
      : defaultSortBy;
  };

  render() {
    const { handle, limit, imageOptions } = this.props;
    const { collectionState, ...other } = this.props;
    const sortBy = this.getSortBy();
    return (
      <Query
        query={Collection.query}
        variables={{
          handle: handle,
          sortKey: sortByOptions[sortBy].key,
          reverse: sortByOptions[sortBy].reverse,
          limit,
          imageMaxWidth: imageOptions ? imageOptions.maxWidth : undefined,
          imageMaxHeight: imageOptions ? imageOptions.maxHeight : undefined,
          imageCrop: imageOptions ? imageOptions.crop : undefined,
          imageScale: imageOptions ? imageOptions.scale : undefined
        }}
      >
        {query => (
          <CollectionProvider
            {...other}
            collectionState={
              collectionState
                ? {
                    sortBy,
                    products: null,
                    ...collectionState
                  }
                : undefined
            }
            query={query}
          />
        )}
      </Query>
    );
  }
}
