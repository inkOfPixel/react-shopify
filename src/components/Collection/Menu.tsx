import * as React from "react";
import styled from "styled-components";
import { Consumer, ILabel } from "./Context";

interface IMenuContext {
  loading: boolean;
  currentRefinement: null | string;
  labels?: Array<ILabel>;
  refine: (value: string) => void;
}

type RenderProp = (context: IMenuContext) => React.ReactNode;

interface IProps {
  children: RenderProp;
  name: string;
}

const MenuConsumer = (props: IProps) => {
  return (
    <Consumer>
      {context => {
        if (typeof props.children !== "function") {
          return null;
        }
        const labels = context.facets[props.name];
        const currentRefinementLabel = labels
          ? labels.find(label => label.isRefined)
          : undefined;
        const currentRefinement = currentRefinementLabel
          ? currentRefinementLabel.value
          : null;
        return props.children({
          loading: context.loading,
          currentRefinement,
          labels,
          refine: value => {
            context.setRefinement({
              kind: "list",
              name: props.name,
              labels: [value]
            });
          }
        });
      }}
    </Consumer>
  );
};

export default class Menu extends React.Component<IProps, {}> {
  render() {
    const { children, name, ...otherProps } = this.props;
    return (
      <MenuConsumer name={name}>
        {context => {
          if (typeof children === "function") {
            return children(context);
          }
          return (
            <List {...otherProps}>
              {context.labels &&
                context.labels.map(label => (
                  <ListItem key={label.value}>
                    <input
                      type="radio"
                      name={`Menu.${name}`}
                      id={`Menu.${name}.${label.value}`}
                      value={label.value}
                      checked={label.isRefined}
                      onChange={event =>
                        context.refine(event.currentTarget.value)
                      }
                    />
                    <label htmlFor={`Menu.${name}.${label.value}`}>
                      {label.value} ({label.count})
                    </label>
                  </ListItem>
                ))}
            </List>
          );
        }}
      </MenuConsumer>
    );
  }
}

const List = styled.div``;

const ListItem = styled.div``;
