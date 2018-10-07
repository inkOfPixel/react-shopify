import * as React from "react";
import styled from "styled-components";
import { Consumer } from "./Context";
import { map } from "lodash-es";
import { hasRefinements } from "./utils";

interface IClearAllRefinementsContext {
  loading: boolean;
  hasRefinements: boolean;
  clearAll: () => void;
}

type RenderProp = (context: IClearAllRefinementsContext) => React.ReactNode;

interface IProps {
  children: React.ReactNode | RenderProp;
  text?: string;
}

const ClearAllRefinementsConsumer = (props: IProps) => {
  return (
    <Consumer>
      {context => {
        if (typeof props.children !== "function") {
          return null;
        }
        return props.children({
          loading: context.loading,
          hasRefinements: hasRefinements(
            map(context.collectionState.refinements)
          ),
          clearAll: context.clearAll
        });
      }}
    </Consumer>
  );
};

export default class ClearAllRefinements extends React.Component<IProps, {}> {
  render() {
    const { children, text = "Clear all" } = this.props;
    return (
      <ClearAllRefinementsConsumer>
        {context => {
          if (typeof children === "function") {
            return children(context);
          }
          if (context.hasRefinements) {
            return (
              <ClearAllButton onClick={context.clearAll}>{text}</ClearAllButton>
            );
          }
          return null;
        }}
      </ClearAllRefinementsConsumer>
    );
  }
}

const ClearAllButton = styled.div`
  border: 1px solid gray;
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  padding: 2px 4px;
`;
