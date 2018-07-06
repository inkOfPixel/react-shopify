// @flow

import React, { type Node, PureComponent } from "react";
import CollectionConsumer from "../Collection/CollectionConsumer";
import type {
  Refinement as RefinementType,
  EnumAttributeValue
} from "../types";

type Props = {
  /** A function to which refinement props are passed and made available for render */
  children: ({
    allValues:
      | Array<EnumAttributeValue<string>>
      | Array<EnumAttributeValue<number>>,
    refine: (value: string | number | boolean) => void,
    clear: () => void
  }) => Node,
  /** Attribute to be refined. Accepts dot notation (e.g. `namedTag.color`) */
  attribute: string,
  /** Default value for refinement */
  defaultRefinement?: string | number | boolean
};

type ConsumerProps = Props & {
  context: {
    updateRefinement: RefinementType => void,
    clearRefinement: (attribute: string) => void,
    getValuesForAttribute: string =>
      | Array<EnumAttributeValue<string>>
      | Array<EnumAttributeValue<number>>
  }
};

class RefinementConsumer extends PureComponent<ConsumerProps> {
  componentDidMount() {
    const { defaultRefinement } = this.props;
    if (defaultRefinement) {
      this.refine(defaultRefinement);
    }
  }

  refine = (value: string | number | boolean) => {
    const {
      context: { updateRefinement },
      attribute
    } = this.props;
    updateRefinement({ attribute, type: "single", value });
  };

  clear = () => {
    const {
      context: { clearRefinement },
      attribute
    } = this.props;
    clearRefinement(attribute);
  };

  render() {
    const {
      children,
      attribute,
      context: { getValuesForAttribute }
    } = this.props;
    return children({
      refine: this.refine,
      clear: this.clear,
      allValues: getValuesForAttribute(attribute)
    });
  }
}

/** The `Refinement` component provides the logic to build a widget that will give the user the ability to choose a single value for a specific attribute. */
const Refinement = (props: Props) => (
  <CollectionConsumer>
    {context => <RefinementConsumer {...props} context={context} />}
  </CollectionConsumer>
);

export default Refinement;
