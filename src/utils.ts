import { createContext } from "react";
import { groupBy, flatten, map, union } from "lodash-es";

export const createNamedContext = <T>(name: string, defaultValue?: T) => {
  const Context = createContext(defaultValue);
  Context.Consumer.displayName = `${name}.Consumer`;
  Context.Provider.displayName = `${name}.Provider`;
  return Context;
};

export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

export const combine = (extractors: ReactShopify.FacetExtractor[]) => (
  product: Storefront.IProduct
) => {
  const facets = flatten(extractors.map(extractor => extractor(product)));
  const facetsGroupedByName = groupBy(facets, "name");
  return map(facetsGroupedByName, (facetsGroup, name) => {
    return {
      name,
      labels: union(...facetsGroup.map(facet => facet.labels))
    };
  });
};

export const productFacet = (attribute: string) => (
  product: Storefront.IProduct
): ReactShopify.IFacet[] => {
  const facets = [];
  const facet = {
    name: attribute,
    labels: [] as string[]
  };
  const attributeValue: any = product[attribute];
  if (
    typeof attributeValue === "number" ||
    typeof attributeValue === "string"
  ) {
    facet.labels = facet.labels.concat(attributeValue.toString());
  } else if (Array.isArray(attributeValue)) {
    facet.labels = facet.labels.concat(
      attributeValue
        .filter(
          label =>
            typeof label === "string" ||
            typeof label === "number" ||
            typeof label === "boolean"
        )
        .map(label => label.toString())
    );
  } else if (attributeValue === undefined) {
    throw new Error(`No attribute named ${attribute} found on product`);
  } else {
    throw new Error(`Can't refine on ${attribute}`);
  }
  facets.push(facet);
  return facets;
};
