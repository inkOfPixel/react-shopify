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
    <Storefront
      accessToken="a60505b6d8a3ac9c78c22719e7dcc4fe"
      url="https://d-one-milano-dev.myshopify.com/api/graphql"
    >
      <Collection imageOptions={{ maxWidth: 200, maxHeight: 200 }}>
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
                  key={value.value}
                >
                  <input
                    type="checkbox"
                    checked={value.isRefined}
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
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center"
                }}
              >
                {products.map(product => (
                  <div key={product.title} style={{ margin: "20px" }}>
                    {Array.isArray(product.images) &&
                    product.images.length > 0 ? (
                      <div>
                        <img
                          src={product.images[0].transformedSrc}
                          alt={product.images[0].altText}
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    {product.title}
                    <div>{JSON.stringify(product.namedTags.color)}</div>
                  </div>
                ))}
              </div>
            );
          }}
        </Products>
      </Collection>
    </Storefront>
  </div>
);

const container = document.getElementById("root");

if (container === null) {
  throw new Error("Could not find root container");
}

render(<App />, container);
