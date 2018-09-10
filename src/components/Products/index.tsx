import * as React from "react";
import { Consumer } from "../Collection/Context";

interface IProductsContext {
  products: Storefront.IProduct[];
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
      <Consumer>
        {context => {
          if (context) {
            if (typeof children === "function") {
              return children({ products: context.getProducts() });
            }
            return context
              .getRefinedProducts()
              .map(product => <Product product={product} key={product.id} />);
          }
          throw new Error(
            "<Products> is being used outside Collection context, and the generic products query is not yet implemented"
          );
        }}
      </Consumer>
    );
  }
}

const DemoProduct = ({ product }: IProductProps) => {
  return <p>{product.title}</p>;
};
