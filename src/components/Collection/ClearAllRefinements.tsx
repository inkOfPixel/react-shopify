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
  children: RenderProp;
  onClick?: (event: any) => void;
}

const ClearAllRefinementsConsumer: React.SFC<IProps> = props => {
  return (
    <Consumer>
      {context => {
        if (typeof props.children !== "function") {
          return null;
        }
        return props.children({
          loading: context.loading,
          hasRefinements: hasRefinements(map(context.refinements)),
          clearAll: context.clearAll
        });
      }}
    </Consumer>
  );
};

export default class ClearAllRefinements extends React.Component<IProps, {}> {
  render() {
    const { children, onClick, ...other } = this.props;
    return (
      <ClearAllRefinementsConsumer>
        {context => {
          if (typeof children === "function") {
            return children(context);
          }
          if (context.hasRefinements) {
            return (
              <ClearAllButton
                onClick={
                  onClick
                    ? event => {
                        onClick(event);
                        context.clearAll();
                      }
                    : context.clearAll
                }
                {...other}
              >
                {children}
              </ClearAllButton>
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
