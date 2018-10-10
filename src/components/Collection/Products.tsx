import * as React from "react";
import { keyBy } from "lodash-es";
import { Consumer } from "./Context";

interface IProductsContext {
  products: Storefront.IProduct[];
  loading: boolean;
}

type RenderProp = (context: IProductsContext) => React.ReactNode;

interface IProductProps {
  product: Storefront.IProduct;
}

interface IProps {
  children: RenderProp;
  /** Provide your custom product item component */
  productComponent?: React.ComponentType<IProductProps>;
}

const ProductsConsumer = (props: IProps) => {
  return (
    <Consumer>
      {context => {
        if (typeof props.children !== "function") {
          return null;
        }
        const { products, refinedIds, loading } = context;
        let refinedProducts: Storefront.IProduct[];
        if (refinedIds) {
          const productsById = keyBy(products, "id");
          refinedProducts = refinedIds.map(id => productsById[id]);
        } else {
          refinedProducts = products;
        }
        return props.children({ loading, products: refinedProducts });
      }}
    </Consumer>
  );
};

export default class Products extends React.Component<IProps, {}> {
  render() {
    const { children, productComponent: Product = DemoProduct } = this.props;
    return (
      <ProductsConsumer>
        {context => {
          if (typeof children === "function") {
            return children(context);
          }
          return context.products.map(product => (
            <Product product={product} key={product.id} />
          ));
        }}
      </ProductsConsumer>
    );
  }
}

const DemoProduct = ({ product }: IProductProps) => {
  return <p>{product.title}</p>;
};
