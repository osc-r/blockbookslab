import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;

  background: linear-gradient(
    128.06deg,
    rgba(210, 251, 143, 0.3) 2.84%,
    rgba(55, 244, 154, 0.3) 31.7%,
    rgba(0, 195, 193, 0.3) 74.49%,
    rgba(251, 248, 143, 0.3) 130.22%
  );

  > div {
    display: flex;
    flex: 1;
    max-width: 1300px;

    margin: 64px auto;
    box-shadow: 5px 5px 20px rgba(0, 145, 160, 0.2);
    border-radius: 45px;

    background-color: white;
  }
`;

const SideBarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  width: 250px;

  padding: 32px;
  border-right: 1px solid #ecedef;

  .collapse {
    margin-top: auto;
  }
  ul {
    padding: 0;

    list-style-type: none;
  }
  li {
    border-radius: 8px;
  }
  li > span {
    display: flex;
    align-items: center;
    height: 35px;
    width: 100%;

    margin-top: 22px;
    border-radius: 8px;
    padding: 8px 12px;

    cursor: pointer;

    span {
      margin-left: 12px;

      font-family: Rubik;
      font-weight: 600;
      font-size: 14px;
      color: #131231;
    }
  }
  li.active {
    background-color: #1a2838;

    span {
      transition: all 0.3s ease-in-out;
      color: white;
    }
    path {
      transition: all 0.3s ease-in-out;
      fill: white;
    }
  }
  .disabled {
    opacity: 0.25;
    > span {
      cursor: not-allowed;
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  padding: 42px 64px;

  .title {
    font-family: Rubik;
    font-weight: 700;
    font-size: 32px;
    color: black;
    text-transform: capitalize;
  }
  .wrapper {
    display: flex;
    justify-content: space-between;

    .button-wrapper > div:first-child > button {
      height: 48px !important;

      padding: 4px 24px !important;
      border-radius: 16px !important;
      border: 1px solid #00c3c1 !important;

      color: #00c3c1 !important;
      font-family: Rubik !important;
      font-weight: 500 !important;
      font-size: 16px !important;
      letter-spacing: 1px !important;
      background: none !important;
      box-shadow: none !important;

      :hover {
        transition: all 0.3s ease-in-out !important;
        background-color: #00c3c1 !important;
        color: white !important;
        transform: none;
      }
    }
  }
  .button-wrapper {
    display: flex;
    align-items: center;
  }
`;

export { AppContainer, SideBarContainer, ContentContainer };
