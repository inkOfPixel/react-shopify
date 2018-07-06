// @flow

import get from "lodash/get";
import type { CollectionProduct, CollectionState } from "./Collection/types";
import type { CategoryAttributeValue } from "./types";

export const getRefinedProducts = (
  collectionState: CollectionState
): CollectionProduct[] => {
  return collectionState.products || [];
};

export const getCategoryItems = (collectionState: CollectionState) => {
  const occurenciesMap = {};
  Object.entries(collectionState.refinementList || {}).forEach(
    ([attribute, refinementList]) => {
      const partialState = omitFilter(
        collectionState,
        "refinementList",
        attribute
      );
      const partiallyRefinedProducts = getRefinedProducts(partialState);
      const valueOccurrences = findAttributeValuesOccurences(
        attribute,
        partiallyRefinedProducts
      );
      occurenciesMap.refinementList = occurenciesMap.refinementList || {};
      occurenciesMap.refinementList[attribute] = valueOccurrences;
    }
  );
  return (
    filterType: string,
    attribute: string
  ): CategoryAttributeValue<mixed>[] => {};
};

const omitFilter = (
  collectionState: CollectionState,
  filterType: string,
  attribute: string
): CollectionState => {
  if (collectionState[filterType]) {
    const {
      [filterType]: { [attribute]: omit, ...filterKeep },
      ...keep
    } = collectionState;
    return {
      ...keep,
      [filterType]: { ...filterKeep }
    };
  }
  return collectionState;
};

const findAttributeValuesOccurences = (
  attribute: string,
  products: CollectionProduct[]
): { [value: mixed]: number } => {
  return products.reduce((occurrences, product) => {
    const value = get(product, attribute);
    if (typeof value === "string" || typeof value === "number") {
      occurrences[value] = occurrences[value] || 0;
      occurrences[value] += 1;
    } else if (Array.isArray(value)) {
      value.forEach(subValue => {
        occurrences[subValue] = occurrences[subValue] || 0;
        occurrences[subValue] += 1;
      });
    } else {
      throw new Error(
        `${attribute} value type ${typeof value} is not a valid refinement value`
      );
    }
    return occurrences;
  }, {});
};

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
