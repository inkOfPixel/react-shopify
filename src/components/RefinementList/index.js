// @flow

import React, { type Node, PureComponent } from "react";
import type {
  Refinement as RefinementType,
  RefinementMap,
  EnumAttributeValue
} from "../types";
import CollectionConsumer from "../Collection/CollectionConsumer";

type Props = {
  /** A function to which refinement props are passed and made available for render */
  children: ({
    toggle: (value: string | number) => void,
    clear: () => void,
    allValues:
      | Array<EnumAttributeValue<string>>
      | Array<EnumAttributeValue<number>>
  }) => Node,
  /** Attribute to be refined. Accepts dot notation (e.g. `namedTag.color`) */
  attribute: string,
  /** Default value for refinement */
  defaultRefinement: Array<string> | Array<number>,
  /** Operator to be applied: `and` means that the product must have each selected value, `or` when the product must have at least one of the selected values */
  operator: "and" | "or"
};

type ConsumerProps = Props & {
  context: {
    refinements: RefinementMap,
    updateRefinement: RefinementType => void,
    clearRefinement: (attribute: string) => void,
    getValuesForAttribute: string =>
      | Array<EnumAttributeValue<string>>
      | Array<EnumAttributeValue<number>>
  }
};

class RefinementListConsumer extends PureComponent<ConsumerProps> {
  static defaultProps = {
    operator: "or"
  };

  toggle = (value: string | number) => {
    const {
      context: { updateRefinement, refinements },
      attribute,
      operator
    } = this.props;
    const refinement = refinements[attribute];
    if (refinement && refinement.type !== "multiple") {
      throw new Error(
        `RefinementList received a refinement of type ${
          refinement.type
        } for attribute ${attribute}`
      );
    }
    let values = refinement ? refinement.values : [];
    if (values.includes(value)) {
      values = values.filter(refVal => refVal !== value);
    } else {
      values = values.concat(value);
    }
    updateRefinement({ attribute, type: "multiple", operator, values });
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
      toggle: this.toggle,
      clear: this.clear,
      allValues: getValuesForAttribute(attribute)
    });
  }
}

/** The `RefinementList` component provides the logic to build a widget that will give the user the ability to choose multiple values for a specific attribute. */
const RefinementList = (props: Props) => (
  <CollectionConsumer>
    {context => <RefinementListConsumer {...props} context={context} />}
  </CollectionConsumer>
);

export default RefinementList;
