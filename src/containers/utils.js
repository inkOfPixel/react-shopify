// @flow

import get from "lodash/get";
import memoizeOne from "memoize-one";
import type {
  CollectionProduct,
  CollectionState,
  Refinement,
  RefinementList
} from "./Collection/types";
import type { RefinementListAttributeItem } from "./types";

export const getRefinedProducts = memoizeOne(
  (collectionState: CollectionState): CollectionProduct[] => {
    console.log("getRefinedProducts", collectionState);
    const products = collectionState.products || [];
    const { refinementList } = collectionState.refinements;
    return products.filter(product => {
      let matches = true;
      if (refinementList) {
        const refinementListEntries: Array<
          [string, RefinementList]
        > = (Object.entries(refinementList): any);
        matches = refinementListEntries.every(([attribute, entry]) => {
          const productAttributeValue = get(product, attribute);
          if (entry.operator === "and") {
            return entry.values.every(value =>
              hasValue(productAttributeValue, value)
            );
          }
          return (
            entry.values.length === 0 ||
            entry.values.some(value => hasValue(productAttributeValue, value))
          );
        });
      }
      return matches;
    });
  }
);

const hasValue = (object: mixed, value: mixed): boolean => {
  if (Array.isArray(object)) {
    return object.includes(value);
  }
  return object === value;
};

export const getRefinementListItems = (
  collectionState: CollectionState,
  attribute: string
): RefinementListAttributeItem<mixed>[] => {
  if (
    !Array.isArray(collectionState.products) ||
    collectionState.products.length === 0
  ) {
    return [];
  }
  const { refinements } = collectionState;
  const allItemsCountMap = findAttributeValuesOccurences(
    attribute,
    collectionState.products
  );
  const refinedProducts = getRefinedProducts(collectionState);
  const refinedCountMap = findAttributeValuesOccurences(
    attribute,
    refinedProducts
  );
  let countIfRefinedMap = refinedCountMap;
  const refinedValues =
    (refinements.refinementList &&
      refinements.refinementList[attribute] &&
      refinements.refinementList[attribute].values.map(value =>
        String(value)
      )) ||
    [];
  if (
    refinements.refinementList &&
    refinements.refinementList[attribute] &&
    refinements.refinementList[attribute].operator === "or"
  ) {
    const partialCollectionState = omitFilter(
      collectionState,
      "refinementList",
      attribute
    );
    const partiallyRefinedProducts = getRefinedProducts(partialCollectionState);
    countIfRefinedMap = findAttributeValuesOccurences(
      attribute,
      partiallyRefinedProducts
    );
  }
  return Array.from(allItemsCountMap).map(([value, count]) => ({
    isRefined: refinedValues.includes(value),
    value,
    refinedCount: refinedCountMap.get(value) || 0,
    countIfRefined: countIfRefinedMap.get(value) || 0
  }));
};

const omitFilter = (
  collectionState: CollectionState,
  filterType: string,
  attribute: string
): CollectionState => {
  if (collectionState.refinements[filterType]) {
    const {
      [filterType]: { [attribute]: omit, ...filterKeep },
      ...keep
    } = collectionState.refinements;
    return {
      ...collectionState,
      refinements: {
        ...keep,
        [filterType]: { ...filterKeep }
      }
    };
  }
  return collectionState;
};

const findAttributeValuesOccurences = (
  attribute: string,
  products: CollectionProduct[]
): Map<mixed, number> => {
  return products.reduce((occurrences, product) => {
    const value = get(product, attribute);
    if (typeof value === "string" || typeof value === "number") {
      occurrences.set(value, (occurrences.get(value) || 0) + 1);
    } else if (Array.isArray(value)) {
      value.forEach(subValue => {
        occurrences.set(subValue, (occurrences.get(subValue) || 0) + 1);
      });
    } else {
      throw new Error(
        `${attribute} value type ${typeof value} is not a valid refinement value`
      );
    }
    return occurrences;
  }, new Map());
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
