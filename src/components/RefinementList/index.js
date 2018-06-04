// @flow

import React, { PureComponent } from "react";
import type { Refinement as RefinementType, RefinementMap } from "../types";
import CollectionConsumer from "../Collection/CollectionConsumer";

type Props = {
  children: Function,
  attribute: string,
  defaultRefinement: Array<string> | Array<number>,
  operator: "and" | "or"
};

type ConsumerProps = Props & {
  refinements: RefinementMap,
  updateRefinement: RefinementType => void,
  clearRefinement: RefinementType => void,
  getAllValuesForAttribute: string => Array<string> | Array<number>,
  getRefinedValuesForAttribute: string => Array<string> | Array<number>
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

const RefinementList = props => (
  <CollectionConsumer>
    {context => <RefinementListConsumer {...props} context={context} />}
  </CollectionConsumer>
);

export default RefinementList;
