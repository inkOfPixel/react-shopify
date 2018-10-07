import React from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .scrollbar-container + div > button[title="Copy to clipboard"] {
    color: #d0d0d0
    &:hover {
      color: #fff;
    }
  }
`;

const Wrapper = ({ children }) => (
  <React.Fragment>
    {children}
    <GlobalStyle />
  </React.Fragment>
);

export default Wrapper;
