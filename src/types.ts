export interface IFacet {
  name: string;
  labels: Array<string>;
}

export type FacetExtractor = (
  product: Storefront.IProduct
) => IFacet | IFacet[];
