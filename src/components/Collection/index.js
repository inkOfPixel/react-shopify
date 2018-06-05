// @flow

import React, { type Node, PureComponent } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import get from "lodash/get";
import { Provider as ContextProvider } from "./CollectionContext";
import type {
  EnumAttributeValue,
  RefinementMap,
  Product,
  Refinement,
  SortBy
} from "../types";
import { getProducts, getRefinedProductIds, sortByOptions } from "../utils";

type Range = {
  min: number,
  max: number
};

type ProviderState = {
  sortBy: SortBy,
  refinements: RefinementMap,
  products: ?Array<Product>,
  refinedProductIds: string[],
  loading: boolean,
  error: ?Error,
  updateRefinement: Refinement => void,
  clearRefinement: (attribute: string) => void,
  changeSortBy: SortBy => void,
  getValuesForAttribute: (
    attribute: string
  ) => Array<EnumAttributeValue<string>> | Array<EnumAttributeValue<number>>,
  getRangeForAttribute: string => Range
};

type Props = {
  children: Node | Function,
  /** Initial Collection sort by: `MANUAL`, `BEST_SELLING`, `LEAST_SELLING`, `TITLE_ASCENDING`, `TITLE_DESCENDING`, `PRICE_ASCENDING`, `PRICE_DESCENDING`, `NEWEST_FIRST`, `OLDEST_FIRST`; */
  initialSortBy: SortBy,
  /** Initial refinement: an object where each key is an attribute and the value represent the attribute refinement */
  initialRefinements: RefinementMap,
  /** Initial graphql data. This is intended for server side and static rendering */
  initialData?: Object,
  /** Shopify collection handle */
  handle: string,
  /** Limit the number of fetched products */
  limit: number,
  /** Image options */
  imageOptions?: {
    maxWidth?: number,
    maxHeight?: number,
    crop?: "CENTER" | "TOP" | "BOTTOM" | "LEFT" | "RIGHT",
    scale?: number
  }
};

type ProviderProps = Props & {
  query: {
    data: ?Object,
    loading: boolean,
    error: ?Error,
    refetch: (variables?: Object) => void
  }
};

class Provider extends PureComponent<ProviderProps, ProviderState> {
  static defaultProps = {
    initialRefinements: {}
  };

  static getDerivedStateFromProps(props: ProviderProps, state: ProviderState) {
    let changes = null;
    const data = props.query.data.shop ? props.query.data : props.initialData;
    let products = data ? getProducts(data) : null;
    if (products) {
      const refinedProductIds = getRefinedProductIds(
        products,
        Object.values(state.refinements)
      );
      if (refinedProductIds !== state.refinedProductIds) {
        changes = changes || {};
        changes.refinedProductIds = refinedProductIds;
      }
    }
    if (products !== state.products) {
      changes = changes || {};
      changes.products = products;
    }
    if (props.query.loading !== state.loading) {
      changes = changes || {};
      changes.loading = props.query.loading;
    }
    if (props.query.error !== state.error) {
      changes = changes || {};
      changes.error = props.query.error;
    }
    return changes;
  }

  constructor(props: ProviderProps) {
    super(props);
    this.state = {
      products: null,
      sortBy: props.initialSortBy,
      refinements: props.initialRefinements,
      refinedProductIds: [],
      loading: props.query.loading,
      error: props.query.error,
      updateRefinement: this.updateRefinement,
      clearRefinement: this.clearRefinement,
      changeSortBy: this.changeSortBy,
      getValuesForAttribute: this.getValuesForAttribute,
      getRangeForAttribute: this.getRangeForAttribute
    };
  }

  getValuesForAttribute = (
    attribute: string
  ): Array<EnumAttributeValue<string>> | Array<EnumAttributeValue<number>> => {
    const { products, refinedProductIds, refinements } = this.state;
    if (!Array.isArray(products)) {
      return [];
    }
    const attributeRefinements = refinements[attribute];
    let refinementsValues = [];
    if (attributeRefinements) {
      switch (attributeRefinements.type) {
        case "single":
          refinementsValues = [attributeRefinements.value];
          break;
        case "multiple":
          refinementsValues = attributeRefinements.values;
          break;
        default:
          throw new Error(
            `Could not get attribute of type ${attributeRefinements.type}`
          );
      }
    }
    const valuesMap = products.reduce((map, product) => {
      const isRefinedProduct =
        refinedProductIds.length > 0
          ? refinedProductIds.includes(product.id)
          : true;
      const newMap = map;
      const value = get(product, attribute);
      if (typeof value === "string" || typeof value === "number") {
        newMap[value] = newMap[value] || {
          isRefined: false,
          value,
          count: 0,
          refinedCount: 0
        };
        newMap[value].isRefined =
          newMap[value].isRefined || refinementsValues.includes(value);
        newMap[value].count++;
        newMap[value].refinedCount += isRefinedProduct ? 1 : 0;
      } else if (Array.isArray(value)) {
        value.forEach(val => {
          newMap[val] = newMap[val] || {
            isRefined: false,
            value: val,
            count: 0,
            refinedCount: 0
          };
          newMap[val].isRefined =
            newMap[val].isRefined || refinementsValues.includes(val);
          newMap[val].count++;
          newMap[val].refinedCount += isRefinedProduct ? 1 : 0;
        });
      }
      return newMap;
    }, {});
    return Object.values(valuesMap);
  };

  getRangeForAttribute = (attribute: string): Range => {
    throw new Error("Not implemented!");
  };

  updateRefinement = (refinement: Refinement) => {
    this.setState(currentState => ({
      refinements: {
        ...currentState.refinements,
        [refinement.attribute]: refinement
      }
    }));
  };

  clearRefinement = (attribute: string) => {
    this.setState(currentState => {
      const newRefinements = { ...currentState.refinements };
      delete newRefinements[attribute];
      return {
        refinements: newRefinements
      };
    });
  };

  changeSortBy = (sortBy: SortBy) => {
    this.setState(
      () => ({ sortBy }),
      () => {
        const { query, handle } = this.props;
        query.refetch({
          handle,
          sortKey: sortByOptions[sortBy].key,
          reverse: sortByOptions[sortBy].reverse
        });
      }
    );
  };

  render() {
    const { children } = this.props;
    return (
      <ContextProvider value={this.state}>
        {typeof children === "function" ? children(this.state) : children}
      </ContextProvider>
    );
  }
}

/**
 * Provides context of a given collection to components like `Products`, `Refinement`, `RefinementList`, `SortBy`
 */
export default class Collection extends PureComponent<Props> {
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
    initialSortBy: "BEST_SELLING",
    initialRefinements: {},
    limit: 250
  };

  render() {
    const { handle, initialSortBy, limit, imageOptions } = this.props;
    return (
      <Query
        query={Collection.query}
        variables={{
          handle: handle,
          sortKey: sortByOptions[initialSortBy].key,
          reverse: sortByOptions[initialSortBy].reverse,
          limit,
          imageMaxWidth: imageOptions ? imageOptions.maxWidth : undefined,
          imageMaxHeight: imageOptions ? imageOptions.maxHeight : undefined,
          imageCrop: imageOptions ? imageOptions.crop : undefined,
          imageScale: imageOptions ? imageOptions.scale : undefined
        }}
      >
        {query => <Provider {...this.props} query={query} />}
      </Query>
    );
  }
}
