import { createContext } from "react";

export const createNamedContext = <T>(name: string, defaultValue?: T) => {
  const Context = createContext(defaultValue);
  Context.Consumer.displayName = `${name}.Consumer`;
  Context.Provider.displayName = `${name}.Provider`;
  return Context;
};

export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

export const productFacet = (attribute: string) => (
  product: Storefront.IProduct
) => {
  const facets = [];
  const facet = {
    name: attribute,
    labels: []
  };
  const attributeValue: any = product[attribute];
  if (
    typeof attributeValue === "number" ||
    typeof attributeValue === "string"
  ) {
    facet.labels.concat(attributeValue);
  }
  facets.push(facet);
  return facets;
};
