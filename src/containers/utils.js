// @flow

import get from "lodash/get";
import memoizeOne from "memoize-one";
import type {
  CollectionProduct,
  CollectionState,
  RefinementList
} from "./Collection/types";
import type { RefinementListAttributeItem } from "./types";

export const getRefinedProducts = memoizeOne(
  (collectionState: CollectionState): CollectionProduct[] => {
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
  // console.log("getRefinementItems");
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

type RefinementItemsMap = {
  refinementList: {
    [attribute: string]: RefinementListAttributeItem<mixed>[]
  }
};

export const getRefinementItems = memoizeOne(
  (collectionState: CollectionState): RefinementItemsMap => {
    const map = {
      refinementList: {}
    };
    const { refinements } = collectionState;
    if (refinements.refinementList) {
      Object.entries(refinements.refinementList).forEach(
        ([attribute, refinementList]) => {
          map.refinementList[attribute] = getRefinementListItems(
            collectionState,
            attribute
          );
        }
      );
    }
    return map;
  }
);

export const removeUnusedRefinements = (
  collectionState: CollectionState
): CollectionState => {
  const refinementItems = getRefinementItems(collectionState);
  const { refinements } = collectionState;
  const refinementList = refinements.refinementList;
  let newRefinements = { ...refinements };
  let hasChanges = false;
  if (refinementList) {
    Object.keys(refinementList).forEach(attribute => {
      const refinableItems = refinementItems.refinementList[attribute]
        .filter(item => item.refinedCount > 0)
        .reduce((map, item) => {
          map.set(item.value, item);
          return map;
        }, new Map());
      const values = refinementList[attribute].values.filter(
        value => refinableItems.get(value) !== undefined
      );

      if (values.length !== refinementList[attribute].values.length) {
        hasChanges = true;
        newRefinements.refinementList = {
          ...newRefinements.refinementList,
          [attribute]: {
            ...newRefinements.refinementList[attribute],
            values
          }
        };
      }
    });
  }
  if (hasChanges) {
    return { ...collectionState, refinements: newRefinements };
  }
  return collectionState;
};
