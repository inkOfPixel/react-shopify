// @flow

import React from "react";
import { render } from "react-dom";
import {
  Storefront,
  Collection,
  Products,
  SortBy,
  Refinement,
  RefinementList
} from "./components";

// quick-sale-app: 02441eee1833a8937a0efee5ff732c2a

const App = () => (
  <div>
    <Storefront accessToken="a60505b6d8a3ac9c78c22719e7dcc4fe">
      <Collection>
        <h1>Collection: all</h1>
        <SortBy>
          {({ sortBy, changeSortBy }) => (
            <select onChange={event => changeSortBy(event.currentTarget.value)}>
              {Object.keys(SortBy.options).map(option => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </SortBy>
        <Refinement attribute="namedTags.gender">
          {({ allValues, refine, clear }) => (
            <select onChange={event => refine(event.currentTarget.value)}>
              {allValues.map(value => (
                <option value={value.value} key={`ref-${value.value}`}>
                  {value.value}
                </option>
              ))}
            </select>
          )}
        </Refinement>
        <RefinementList attribute="namedTags.color" operator="and">
          {({ allValues, toggle, clear }) => (
            <div>
              {allValues.map(value => (
                <div
                  style={{ fontWeight: value.isRefined ? "bold" : "normal" }}
                >
                  <input
                    type="checkbox"
                    checked={value.isRefined}
                    key={value.value}
                    onChange={event => toggle(value.value)}
                  />
                  {value.value} ({value.count}, {value.refinedCount})
                </div>
              ))}
            </div>
          )}
        </RefinementList>
        <Products>
          {({ products, loading, error }) => {
            if (loading) {
              return <div>Loading...</div>;
            }
            if (error) {
              return <div>{error.message}</div>;
            }
            return (
              <ul>
                {products.map(product => (
                  <li key={product.title}>
                    {product.title}
                    <div>{JSON.stringify(product.namedTags.color)}</div>
                  </li>
                ))}
              </ul>
            );
          }}
        </Products>
      </Collection>
    </Storefront>
  </div>
);

render(<App />, document.getElementById("root"));
