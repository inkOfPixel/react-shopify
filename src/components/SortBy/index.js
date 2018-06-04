// @flow

import React from "react";
import CollectionConsumer from "../Collection/CollectionConsumer";
import { sortByOptions } from "../utils";

type Props = {
  children: Function
};

const SortBy = ({ children }: Props) => (
  <CollectionConsumer>
    {({ sortBy, changeSortBy }) => children({ sortBy, changeSortBy })}
  </CollectionConsumer>
);

SortBy.options = sortByOptions;

export default SortBy;
