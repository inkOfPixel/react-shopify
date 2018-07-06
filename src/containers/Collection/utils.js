// @flow

import type { CollectionProduct } from "./types";
import type { NamedTag } from "../types";

const namedTagRegExp = /([^:]+)(?::(boolean|number|encoded))?:(.*)/;

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

export const getProducts = (data: ?Object): ?Array<CollectionProduct> => {
  return data && data.shop
    ? data.shop.collectionByHandle.products.edges.map(({ node }) => {
        const product = {
          ...node,
          variants: node.variants
            ? node.variants.edges.map(edge => edge.node)
            : undefined,
          images: node.images
            ? node.images.edges.map(edge => edge.node)
            : undefined
        };
        return withNamedTags(product);
      })
    : null;
};

function withNamedTags(product: CollectionProduct): CollectionProduct {
  return {
    ...product,
    namedTags: product.tags.reduce((obj, tag) => {
      if (isNamedTag(tag)) {
        const namedTag = parseNamedTag(tag);
        if (namedTag) {
          return {
            ...obj,
            [namedTag.name]:
              obj[namedTag.name] === undefined
                ? namedTag.value
                : Array.isArray(obj[namedTag.name])
                  ? obj[namedTag.name].concat(namedTag.value)
                  : [obj[namedTag.name], namedTag.value]
          };
        }
        throw new Error(`tag ${tag} of "${product.title}" is not a named tag`);
      }
      return obj;
    }, {})
  };
}

export function isNamedTag(tag: string): boolean {
  return namedTagRegExp.test(tag);
}

export function parseNamedTag(tag: string): ?NamedTag {
  const result = tag.match(namedTagRegExp);
  if (Array.isArray(result)) {
    const name = result[1];
    const type = result[2];
    let value;
    switch (type) {
      case "number":
        value = parseFloat(result[3]);
        break;
      case "boolean":
        value = Boolean(result[3]);
        break;
      default:
        value = result[3];
        break;
    }
    return {
      name,
      type,
      value
    };
  }
  return null;
}
