// @flow

import React, { type Node } from "react";
import intersectionWith from "lodash/intersectionWith";
import CollectionConsumer from "../Collection/CollectionConsumer";

type Props = {
  /** A function to which products props are passed and made available for render */
  children: ({
    products: Object[],
    loading: boolean,
    error: Error
  }) => Node
};

/** The `Products` component provides the logic to create widget components that will render the results of the `Collection` context. */
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
