import * as React from "react";
import { Consumer, SortByOption, sortByOptions } from "./Context";

interface ISortByContext {
  loading: boolean;
  options: string[];
  selectedOption: string;
  changeSortBy: (sortBy: SortByOption) => void;
}

type RenderProp = (context: ISortByContext) => React.ReactNode;

interface IProps {
  children: RenderProp;
}

const SortByConsumer = (props: IProps) => {
  return (
    <Consumer>
      {context => {
        if (typeof props.children !== "function") {
          return null;
        }
        const { changeSortBy, loading } = context;
        return props.children({
          loading,
          options: Object.keys(sortByOptions),
          selectedOption: context.sortBy,
          changeSortBy
        });
      }}
    </Consumer>
  );
};

export default class SortBy extends React.Component<IProps, {}> {
  render() {
    const { children } = this.props;
    return (
      <SortByConsumer>
        {context => {
          if (typeof children === "function") {
            return children(context);
          }
          return (
            <select
              value={context.selectedOption}
              onChange={event =>
                context.changeSortBy(event.currentTarget.value as SortByOption)
              }
            >
              {context.options.map(option => {
                return (
                  <option value={option} key={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          );
        }}
      </SortByConsumer>
    );
  }
}
