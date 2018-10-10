import * as React from "react";
import { map } from "lodash-es";
import styled from "styled-components";
import { Consumer, Refinement } from "./Context";

interface ICurrentRefinementsContext {
  loading: boolean;
  currentRefinements: Refinement[];
  clear: (name: string, value: string) => void;
}

type RenderProp = (context: ICurrentRefinementsContext) => React.ReactNode;

interface IProps {
  children: RenderProp;
}

const CurrentRefinementsConsumer = (props: IProps) => {
  return (
    <Consumer>
      {context => {
        if (typeof props.children !== "function") {
          return null;
        }
        return props.children({
          loading: context.loading,
          currentRefinements: map(
            context.refinements,
            (refinement: Refinement) => refinement
          ),
          clear: (name: string, value: string) => {
            const refinement = context.refinements[name];
            if (!refinement) {
              throw new Error(
                `Can't clear refinement on ${name}: No such refinement found`
              );
            }
            const labels = refinement.labels.filter(label => label !== value);
            if (labels.length === 0) {
              context.clearRefinement(name);
            } else {
              context.setRefinement({
                ...refinement,
                labels
              });
            }
          }
        });
      }}
    </Consumer>
  );
};

export default class CurrentRefinements extends React.Component<IProps, {}> {
  render() {
    const { children } = this.props;
    return (
      <CurrentRefinementsConsumer>
        {context => {
          if (typeof children === "function") {
            return children(context);
          }
          return (
            <List>
              {context.currentRefinements.map(refinement => (
                <RefinementTag key={refinement.name}>
                  <span className="refinementName">{refinement.name}:</span>
                  <ul>
                    {refinement.labels.map(label => (
                      <li key={label}>
                        <span>{label}</span>
                        <button
                          onClick={() => context.clear(refinement.name, label)}
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </RefinementTag>
              ))}
            </List>
          );
        }}
      </CurrentRefinementsConsumer>
    );
  }
}

const List = styled.div`
  & > :not(:first-child) {
    margin-left: 10px;
  }
`;

const RefinementTag = styled.div`
  border: 1px solid gray;
  border-radius: 2px;
  display: inline-block;
  padding: 2px 4px;
  ul {
    list-style: none;
    display: inline-block;
    margin: 0;
    padding: 0;
    li {
      display: inline;
      margin-left: 5px;
    }
  }
`;
