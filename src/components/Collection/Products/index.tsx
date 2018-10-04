import * as React from "react";
import { keyBy } from "lodash";
import Collection from "../";

interface IProductsContext {
  products: Storefront.IProduct[];
  loading: boolean;
}

type RenderProp = (context: IProductsContext) => React.ReactNode;

interface IProductProps {
  product: Storefront.IProduct;
}

interface IProps {
  children: React.ReactNode | RenderProp;
  /** Provide your custom product item component */
  productComponent?: React.ComponentType<IProductProps>;
}

export default class Products extends React.Component<IProps, {}> {
  render() {
    const { children, productComponent: Product = DemoProduct } = this.props;
    return (
      <Collection.Consumer>
        {context => {
          const { products, refinedIds, loading } = context;
          let refinedProducts;
          if (refinedIds) {
            const productsById = keyBy(products, "id");
            refinedProducts = refinedIds.map(id => productsById[id]);
          } else {
            refinedProducts = products;
          }

          if (typeof children === "function") {
            return children({ products: refinedProducts, loading });
          }
          console.log(context);
          return refinedProducts.map(product => (
            <Product product={product} key={product.id} />
          ));
        }}
      </Collection.Consumer>
    );
  }
}

const DemoProduct = ({ product }: IProductProps) => {
  return <p>{product.title}</p>;
};
