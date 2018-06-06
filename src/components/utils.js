// @flow

import get from "lodash/get";
import type { Refinement, Product, NamedTag } from "./types";

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

export function getProducts(data: Object): null | Product[] {
  return data
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
}

export function getRefinedProductIds(
  products: Array<Product>,
  refinements: Array<Refinement>
): Array<string> {
  const filteredProducts = products.filter(product => {
    return refinements.every(refinement => {
      const value = get(product, refinement.attribute);
      switch (refinement.type) {
        case "single":
          return Array.isArray(value)
            ? value.includes(refinement.value)
            : value === refinement.value;
        case "multiple":
          switch (refinement.operator) {
            case "and":
              const res = refinement.values.every(
                refValue =>
                  Array.isArray(value)
                    ? value.includes(refValue)
                    : value === refValue
              );
              return res;
            case "or":
              return (
                refinement.values.length === 0 ||
                refinement.values.some(
                  refValue =>
                    Array.isArray(value)
                      ? value.includes(refValue)
                      : value === refValue
                )
              );
            default:
              throw new Error(`Operator ${refinement.operator} not defined`);
          }
        case "range":
          throw new Error(
            `Refinement of type ${refinement.type} not implemented`
          );
        default:
          throw new Error(`Invalid type for refinement (${refinement.type})`);
      }
    });
  });
  return filteredProducts.map(product => product.id);
}

function withNamedTags(product: Product): Product {
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
