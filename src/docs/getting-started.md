React Shopify offers a set of components that allows interaction with the Storefront API. Here's a quick example:

```jsx
<Storefront
  accessToken="078bc5caa0ddebfa89cccb4a1baa1f5c"
  url="https://graphql.myshopify.com/api/graphql"
>
  <Collection
    handle="summer-collection"
    limit={5}
    imageOptions={{ maxWidth: 200, maxHeight: 200 }}
  >
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
              <div key={product.title} style={{ margin: "20px", width: 250 }}>
                {Array.isArray(product.images) && product.images.length > 0 ? (
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
              </div>
            ))}
          </div>
        );
      }}
    </Products>
  </Collection>
</Storefront>
```
