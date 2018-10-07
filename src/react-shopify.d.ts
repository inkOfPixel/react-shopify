declare namespace ReactShopify {
  interface IFacet {
    name: string;
    labels: Array<string> | string;
  }

  type FacetExtractor = (product: Storefront.IProduct) => ReactShopify.IFacet[];
}
