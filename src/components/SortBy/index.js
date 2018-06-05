// @flow

import React, { type Node } from "react";
import CollectionConsumer from "../Collection/CollectionConsumer";
import { sortByOptions } from "../utils";
import type { SortBy as SortByType } from "../types";

type Props = {
  /** A function to which sortBy props are passed and made available for render */
  children: ({ sortBy: SortByType, changeSortBy: Function }) => Node
};

/** The `SortBy` component provides the logic to build a widget that will allow a user to change how the collection products are being sorted. */
const SortBy = ({ children }: Props) => (
  <CollectionConsumer>
    {({ sortBy, changeSortBy }) => children({ sortBy, changeSortBy })}
  </CollectionConsumer>
);

SortBy.options = sortByOptions;

export default SortBy;
