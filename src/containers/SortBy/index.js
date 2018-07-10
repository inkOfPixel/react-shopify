// @flow

import React, { type Node } from "react";
import { withCollection } from "../Collection";
import { sortByOptions } from "../Collection/utils";
import type {
  SortBy as SortByType,
  CollectionContext
} from "../Collection/types";

type Props = {
  /** A function to which sortBy props are passed and made available for render */
  children: ({ sortBy: SortByType, changeSortBy: SortByType => void }) => Node,
  /** @ignore */
  collection: CollectionContext
};

/** The `SortBy` component provides the logic to build a widget that will allow a user to change how the collection products are being sorted. */
class SortBy extends React.Component<Props> {
  static options = Object.keys(sortByOptions);

  changeSortBy = (value: SortByType) => {
    const { collection } = this.props;
    if (collection.collectionState.sortBy !== value) {
      collection.updateCollectionState({ sortBy: value });
    }
  };

  render() {
    const {
      children,
      collection: {
        collectionState: { sortBy }
      }
    } = this.props;
    return children({ sortBy, changeSortBy: this.changeSortBy });
  }
}

export default withCollection(SortBy);
