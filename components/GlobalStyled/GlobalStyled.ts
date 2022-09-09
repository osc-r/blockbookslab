import { createGlobalStyle } from "styled-components";

const GlobalStyled = createGlobalStyle`
  html,
  body {
    color: ${({ theme }) => theme.colors.primary};
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  * {
    box-sizing: border-box;
    user-select: none;
  }

  #__next > div{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;

    overflow: auto;
  }
  button{
    border: none;
    
    cursor: pointer;
    background-color: transparent;
  }
`;

export default GlobalStyled;
