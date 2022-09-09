import styled from "styled-components";

const HeaderStyled = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  padding-top: 24px;

  .logo {
    min-height: 72px;
    max-width: 72px;
  }
`;

const NavStyled = styled.nav`
  display: flex;
  justify-content: center;

  ul {
    list-style-type: none;
  }

  li {
    float: left;
    margin-left: 30px;

    color: black;
    font-family: Rubik;
    font-weight: 400;
    letter-spacing: 0.4px;
  }
`;

export { HeaderStyled, NavStyled };
