import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import memoizeOne from "memoize-one";

type RenderProp = (format: (value: string) => string) => React.ReactNode;

interface IProps {
  /** A string representing the money amount or a function that is called with the `format` function as an argument */
  children: string | RenderProp;
  /** A default money format, useful for statically render the component (e.g. `"${{amount}}"`) */
  defaultMoneyFormat?: string;
}

interface IFormatOptions {
  precision?: number;
  thousands?: string;
  decimal?: string;
}

const moneyFormatRegExp = /\{\{\s*(\w+)\s*\}\}/;

const query = gql`
  query MoneyQuery {
    shop {
      moneyFormat
    }
  }
`;

/** The `Money` component provides the logic to render a formatted money amount according to store setting. */
const Money = ({ children, defaultMoneyFormat }: IProps) => {
  return (
    <Query query={query}>
      {query => {
        const { data } = query;
        if (data && data.shop && data.shop.moneyFormat) {
          const format = createFormatFunction(data.shop.moneyFormat);
          return typeof children === "function" ? (
            children(format)
          ) : (
            <span dangerouslySetInnerHTML={{ __html: format(children) }} />
          );
        } else if (typeof defaultMoneyFormat === "string") {
          const format = createFormatFunction(defaultMoneyFormat);
          return typeof children === "function" ? (
            children(format)
          ) : (
            <span dangerouslySetInnerHTML={{ __html: format(children) }} />
          );
        }
        return null;
      }}
    </Query>
  );
};

const createFormatFunction = memoizeOne(
  (moneyFormat: string) => (value: string) =>
    _format(parseFloat(value) * 100, moneyFormat)
);

const _format = (cents: number, format: string = "${{amount}}") => {
  let formattedValue;
  let match = format.match(moneyFormatRegExp);
  if (match && match[1]) {
    switch (match[1]) {
      case "amount":
        formattedValue = formatWithDelimiters(cents, { precision: 2 });
        break;
      case "amount_no_decimals":
        formattedValue = formatWithDelimiters(cents, { precision: 0 });
        break;
      case "amount_with_comma_separator":
        formattedValue = formatWithDelimiters(cents, {
          precision: 2,
          thousands: ".",
          decimal: ","
        });
        break;
      case "amount_no_decimals_with_comma_separator":
        formattedValue = formatWithDelimiters(cents, {
          precision: 0,
          thousands: ".",
          decimal: ","
        });
        break;
      default:
        formattedValue = (cents / 100).toFixed(2);
    }
    return format.replace(moneyFormatRegExp, formattedValue);
  }
  throw new Error("Unknown money format");
};

const formatWithDelimiters = (
  number: number,
  options?: IFormatOptions
): string => {
  const { precision = 2, thousands = ",", decimal = "." } = options || {};
  const numberStr = (number / 100).toFixed(precision);
  const parts = numberStr.split(".");
  const dollars = parts[0].replace(
    /(\d)(?=(\d\d\d)+(?!\d))/g,
    "$1" + thousands
  );
  const cents = parts[1] ? `${decimal}${parts[1]}` : "";

  return `${dollars}${cents}`;
};

export default Money;
