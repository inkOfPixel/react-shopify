import * as React from "react";
import { Consumer, ILabel, IRefinementList } from "./Context";

interface IRefinementListContext {
  loading: boolean;
  currentRefinement: string[];
  labels: Array<ILabel>;
  refine: (value: string) => void;
}

type RenderProp = (context: IRefinementListContext) => React.ReactNode;

interface IProps {
  children: React.ReactNode | RenderProp;
  name: string;
  operator?: "or" | "and";
}

const RefinementListConsumer = (props: IProps) => {
  return (
    <Consumer>
      {context => {
        if (typeof props.children !== "function") {
          return null;
        }
        let currentRefinement: string[] = [];
        const refinement = context.collectionState.refinements[props.name];
        if (refinement) {
          if (refinement.kind === "list") {
            currentRefinement = refinement.labels;
          } else {
            throw new Error(
              `Refinement ${props.name} is not a refinement list`
            );
          }
        }
        return props.children({
          loading: context.loading,
          currentRefinement,
          labels: context.facets[props.name] ? context.facets[props.name] : [],
          refine: value => {
            let newRefinement: IRefinementList;
            let newRefinementLabels;
            if (currentRefinement.includes(value)) {
              newRefinementLabels = currentRefinement.filter(
                refValue => refValue !== value
              );
            } else {
              newRefinementLabels = currentRefinement.concat(value);
            }
            if (refinement) {
              newRefinement = {
                ...refinement,
                labels: newRefinementLabels
              };
            } else {
              newRefinement = {
                kind: "list",
                name: props.name,
                labels: newRefinementLabels,
                operator: props.operator
              };
            }
            context.setRefinement(newRefinement);
          }
        });
      }}
    </Consumer>
  );
};

export default class RefinementList extends React.Component<IProps, {}> {
  render() {
    const { children, operator, name, ...otherProps } = this.props;
    return (
      <RefinementListConsumer name={name} operator={operator}>
        {context => {
          if (typeof children === "function") {
            return children(context);
          }
          return (
            <div {...otherProps}>
              {context.labels.map(label => (
                <div key={label.value}>
                  <input
                    type="checkbox"
                    name={`RefinementList.${name}`}
                    id={`RefinementList.${name}.${label.value}`}
                    value={label.value}
                    checked={label.isRefined}
                    onChange={event =>
                      context.refine(event.currentTarget.value)
                    }
                  />
                  <label htmlFor={`RefinementList.${name}.${label.value}`}>
                    {label.value} ({label.count})
                  </label>
                </div>
              ))}
            </div>
          );
        }}
      </RefinementListConsumer>
    );
  }
}
