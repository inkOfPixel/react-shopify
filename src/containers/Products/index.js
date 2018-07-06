// @flow

import React, { type Node } from "react";
import { withCollection } from "../Collection/";
import type { CollectionContext, CollectionProduct } from "../Collection/types";
import { getRefinedProducts } from "../utils";

type Props = {
  /** A function to which products props are passed and made available for render */
  children: ({
    products: CollectionProduct[],
    loading: boolean,
    error: ?Error
  }) => Node,
  collection: CollectionContext
};

/** The `Products` component provides the logic to create widget components that will render the results of the `Collection` context. */
const Products = ({ children, collection }: Props) =>
  children({
    products: getRefinedProducts(collection.collectionState),
    loading: collection.loading,
    error: collection.error
  });

export default withCollection(Products);
