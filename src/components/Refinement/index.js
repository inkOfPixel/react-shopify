// @flow

import React, { PureComponent } from "react";
import CollectionConsumer from "../Collection/CollectionConsumer";
import { type Refinement as RefinementType } from "../types";

type Props = {
  children: Function,
  attribute: string,
  defaultRefinement: string | number | boolean
};

type ConsumerProps = Props & {
  context: {
    updateRefinement: RefinementType => void,
    clearRefinement: RefinementType => void,
    getValuesForAttribute: string => Array<string> | Array<number>
  }
};

class RefinementConsumer extends PureComponent<ConsumerProps> {
  refine = (value: string | number) => {
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

const Refinement = (props: Props) => (
  <CollectionConsumer>
    {context => <RefinementConsumer {...props} context={context} />}
  </CollectionConsumer>
);

export default Refinement;
