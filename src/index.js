// @flow

import React from "react";
import { render } from "react-dom";
import {
  Storefront,
  Collection,
  CurrentRefinements,
  Products,
  RefinementList,
  SortBy
} from "./containers";

// quick-sale-app: 02441eee1833a8937a0efee5ff732c2a

type Props = {};

type State = {
  collectionState: any
};

class App extends React.Component<Props, State> {
  state = {
    collectionState: {}
  };

  handleCollectionStateChange = (collectionState: any) => {
    this.setState({ collectionState });
  };

  render() {
    return (
      <div>
        <Storefront
          accessToken="a60505b6d8a3ac9c78c22719e7dcc4fe"
          url="https://d-one-milano-dev.myshopify.com/api/graphql"
        >
          <Collection
            collectionState={this.state.collectionState}
            onCollectionStateChange={this.handleCollectionStateChange}
            imageOptions={{ maxWidth: 200, maxHeight: 200 }}
          >
            <h1>Collection: all</h1>
            <strong>Sorting: </strong>
            <SortBy>
              {({ sortBy, changeSortBy }) => (
                <select
                  onChange={event => changeSortBy(event.currentTarget.value)}
                  value={sortBy}
                >
                  {SortBy.options.map(option => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </SortBy>
            <br />
            <strong>Applied refinements</strong>
            <br />
            <CurrentRefinements>
              {({ refinements }) => <code>{JSON.stringify(refinements)}</code>}
            </CurrentRefinements>
            <br />
            <strong>Refinements</strong>
            <RefinementList attribute="namedTags.gender">
              {({ items, toggle, clear }) => (
                <div>
                  {items.map(item => (
                    <div
                      style={{ fontWeight: item.isRefined ? "bold" : "normal" }}
                      key={item.value}
                    >
                      <input
                        type="checkbox"
                        checked={item.isRefined}
                        onChange={event => toggle(item.value)}
                      />
                      {item.value} ({item.countIfRefined}, {item.refinedCount})
                    </div>
                  ))}
                </div>
              )}
            </RefinementList>
            <br />
            <RefinementList attribute="namedTags.color">
              {({ items, toggle, clear }) => (
                <div>
                  {items.map(item => (
                    <div
                      style={{ fontWeight: item.isRefined ? "bold" : "normal" }}
                      key={item.value}
                    >
                      <input
                        type="checkbox"
                        checked={item.isRefined}
                        onChange={event => toggle(item.value)}
                      />
                      {item.value} ({item.countIfRefined}, {item.refinedCount})
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
  }
}

const container = document.getElementById("root");

if (container === null) {
  throw new Error("Could not find root container");
}

render(<App />, container);
