import { createContext } from "react";
import { groupBy, flatten, map, union, get } from "lodash-es";
import { IFacet, FacetExtractor } from "./types";

export const createNamedContext = <T>(name: string, defaultValue?: T) => {
  const Context = createContext(defaultValue);
  Context.Consumer.displayName = `${name}.Consumer`;
  Context.Provider.displayName = `${name}.Provider`;
  return Context;
};

export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

export const combine = (extractors: FacetExtractor[]) => (
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
): IFacet => {
  const facet: IFacet = {
    name: attribute,
    labels: []
  };
  // @ts-ignore
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
  return facet;
};

type StringNamedTag = {
  name: string;
  type: "string";
  value: string;
};

type BooleanNamedTag = {
  name: string;
  type: "boolean";
  value: boolean;
};

type NumberNamedTag = {
  name: string;
  type: "number";
  value: number;
};

type EncodedNamedTag = {
  name: string;
  type: "encoded";
  value: string;
};

export type NamedTag =
  | StringNamedTag
  | BooleanNamedTag
  | NumberNamedTag
  | EncodedNamedTag;

const namedTagRegExp = /([^:]+)(?::(boolean|number|encoded))?:(.*)/;

function isNamedTag(tag: string): boolean {
  return namedTagRegExp.test(tag);
}

function parseNamedTag(tag: string): null | NamedTag {
  const result = tag.match(namedTagRegExp);
  if (Array.isArray(result)) {
    const name = result[1];
    const type = result[2] as "string" | "boolean" | "number" | "encoded";
    let value: number | boolean | string;
    switch (type) {
      case "number":
        value = parseFloat(result[3]);
        return {
          name,
          type,
          value
        };
      case "boolean":
        value = Boolean(result[3]);
        return {
          name,
          type,
          value
        };
      default:
        value = result[3];
        // @ts-ignore
        return {
          name,
          type,
          value
        };
    }
  }
  return null;
}

export const namedTagFacet = (name: string) => (
  product: Storefront.IProduct
): IFacet => {
  const tags = product.tags;
  if (!tags) {
    throw new Error(
      "Must request 'tags' in product fragment to be able to extract named tags"
    );
  }
  return {
    name,
    labels: tags
      .filter(isNamedTag)
      .map(parseNamedTag)
      .filter(tag => tag !== null && tag.name === name)
      .map(tag => (tag as NamedTag).value.toString())
  };
};

export const variantOptionFacet = (optionName: string) => (
  product: Storefront.IProduct
): IFacet => {
  const variantsEdges: Storefront.IProductVariantEdge[] | undefined = get(
    product,
    "variants.edges"
  );
  if (!variantsEdges) {
    throw new Error(
      `Can't extract variant option "${optionName}": Product fragment is missing variants`
    );
  }
  const variants = variantsEdges.map(edge => edge.node);
  return {
    name: optionName,
    labels: variants.reduce(
      (labels, variant) => {
        if (!variant.selectedOptions) {
          throw new Error(
            `Can't extract variant option ${optionName}: Product fragment is missing variant "selectedOptions"`
          );
        }
        const facetOption = variant.selectedOptions.find(
          option => option.name === optionName
        );
        return facetOption ? labels.concat(facetOption.value) : labels;
      },
      [] as string[]
    )
  };
};
