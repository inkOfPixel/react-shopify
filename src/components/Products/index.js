// @flow

import React from "react";
import intersectionWith from "lodash/intersectionWith";
import CollectionConsumer from "../Collection/CollectionConsumer";

type Props = {
  children: Function
};

const Products = ({ children }: Props) => (
  <CollectionConsumer>
    {({ products, refinedProductIds, loading, error }) =>
      children({
        products: Array.isArray(refinedProductIds)
          ? intersectionWith(
              products,
              refinedProductIds,
              (product, id) => product.id === id
            )
          : products,
        loading,
        error
      })
    }
  </CollectionConsumer>
);

export default Products;
