`Money` retrieves the shop money format and provides a way to render formatted children:

```jsx static
<Money>24</Money>
```

When passed a `function` as children, the component calls it with the format function as a parameter:

```jsx static
<Money>{format => <div>{format(24)}</div>}</Money>
```

This is useful especially when the store money format includes markup (e.g. `<span class="money">${{amount}}</span>`):

```jsx static
<Money>
  {format => <strong dangerouslySetInnerHTML={{ __html: format(24) }} />}
</Money>
```
