import styled from "styled-components";

const NotificationButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  position: relative;

  margin-left: 16px;
  border: 1px solid #00c3c1;
  border-radius: 16px;

  color: #00c3c1;
  z-index: 3;
  background-color: white;
  :hover {
    transition: all 0.3s ease-in-out !important;
    background-color: #00c3c1 !important;
    color: white !important;
    transform: none;
    z-index: 3;
  }

  .badge {
    position: absolute;
    top: -12px;
    right: -8px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;

    border-radius: 100%;

    font-size: 12px;
    background-color: red;
    color: white;
  }
`;

const NotificationBox = styled.div<{ isOpen: boolean; isSmall: boolean }>`
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  height: ${({ isSmall }) => (isSmall ? "250px" : "fit-content")};
  max-height: ${({ isOpen }) => (isOpen ? "65vh" : "auto")};
  width: 350px;
  max-height: ${({ isOpen }) => (isOpen ? "65vh" : "0px")};
  max-width: ${({ isOpen }) => (isOpen ? 350 : 0)}px;
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};

  padding: 8px;
  border-radius: 12px;

  background-color: white;
  box-shadow: 5px 5px 20px rgba(0, 145, 160, 0.2);
  z-index: 2;
  transition: all ease-in-out 0.3s;

  .box {
    display: flex;
    flex-direction: column;
    max-height: 100%;

    padding-right: 8px;

    overflow-y: auto;

    > div {
    }
  }
  .ant-result-title {
    font-size: 18px;
    color: #00c3c1;
    font-family: Rubik;
  }
  .ant-result {
    height: 100%;
  }
`;

const Backdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};

  background-color: ${({ isOpen }) =>
    isOpen ? "rgba(0, 0, 0, 0.3)" : "transparent"};
  z-index: 1;
  transition: all ease-in-out 0.3s;
`;

export { NotificationButton, NotificationBox, Backdrop };
