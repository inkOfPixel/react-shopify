// @flow

import get from "lodash/get";
import type { NamedTag } from "./types";
import type { CollectionProduct, CollectionState } from "./Collection/types";

export const getRefinedProducts = (
  collectionState: CollectionState
): Array<CollectionProduct> => {
  return [];
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
