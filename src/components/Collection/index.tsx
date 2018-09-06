import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { createNamedContext } from "../../utils";

enum SortKey {
  Manual = "MANUAL",
  BestSelling = "BEST_SELLING",
  Title = "TITLE",
  Price = "PRICE",
  Created = "CREATED",
  CollectionDefault = "COLLECTION_DEFAULT",
  Id = "ID",
  Relevance = "RELEVANCE"
}

enum SortBy {
  Manual = "MANUAL",
  BestSelling = "BEST_SELLING",
  LeastSelling = "LEAST_SELLING",
  TitleAscending = "TITLE_ASCENDING",
  TitleDescending = "TITLE_DESCENDING",
  PriceAscending = "PRICE_ASCENDING",
  PriceDescending = "PRICE_DESCENDING",
  NewestFirst = "NEWEST_FIRST",
  OldestFirst = "OLDEST_FIRST"
}

enum RefinementType {
  List = "LIST",
  Range = "RANGE"
}

interface IRefinement {
  type: RefinementType;
  attribute: string;
}

interface IRefinementList extends IRefinement {
  values: string;
}

interface IRefinementRange extends IRefinement {
  range: string;
}

interface ICollectionState {
  sortBy: SortBy;
  refinements: Array<IRefinementList | IRefinementRange>;
}

interface ICollectionContext {
  data: {
    shop?: {
      collectionByHandle: null | {
        products: {
          edges: Array<any>;
        };
      };
    };
  };
}

const CollectionContext = createNamedContext(
  "Collection",
  {} as ICollectionContext
);

interface IProps {
  children: React.ReactNode;
  initialState?: ICollectionState;
  handle: string;
  /** By default it fetches only id and title */
  productFragment?: string;
}

interface IState {
  query: string;
}

export default class Collection extends React.Component<IProps, IState> {
  static defaultProps = {
    productFragment: gql`
      fragment CollectionProduct on Product {
        id
        title
      }
    `
  };

  state = {
    query: gql`
      query CollectionQuery(
        $handle: String!
        $sortKey: ProductCollectionSortKeys
        $reverse: Boolean
        $limit: Int!
      ) {
        shop {
          collectionByHandle(handle: $handle) {
            products(first: $limit, sortKey: $sortKey, reverse: $reverse) {
              edges {
                node {
                  ...CollectionProduct
                }
              }
            }
          }
        }
      }
      ${this.props.productFragment}
    `
  };

  render() {
    const { children, handle } = this.props;
    return (
      <Query query={this.state.query} variables={{ handle, limit: 10 }}>
        {query => (
          <div>
            <p>{JSON.stringify(query.data, null, "  ")}</p>
          </div>
        )}
      </Query>
    );
  }
}

interface IImplProps {
  initialState: ICollectionState;
}

class CollectionImpl extends React.Component<IImplProps> {
  getContext = (): ICollectionContext => {
    return {};
  };

  render() {
    return (
      <CollectionContext.Provider value={this.getContext()}>
        {this.props.children}
      </CollectionContext.Provider>
    );
  }
}
