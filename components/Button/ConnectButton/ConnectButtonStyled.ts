import styled from "styled-components";

const ConnectButtonStyled = styled.div<{ isOpen: boolean }>`
  .open-connect-modal-btn {
    height: 48px;

    padding: 4px 24px;
    border-radius: 16px;
    border: 1px solid #00c3c1;

    color: #00c3c1;
    font-family: Rubik;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 1px;
    background: none;
    box-shadow: none;
  }
  h2 {
    margin-bottom: 24px;
    text-align: center;
  }
  .modal {
    display: flex;
    flex-direction: column;
    width: 360px;
    position: fixed;
    top: 50%;
    left: 50%;

    margin: auto;
    padding: 32px;
    border-radius: 16px;

    background-color: white;
    transform: translate(-50%, -50%);
    visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
    transition: all ease-in-out 0.3s;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};

    div:nth-child(3) > {
      button {
        height: 48px !important;
        width: 100% !important;

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

        text-align: center;

        visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
        transition: all ease-in-out 0.3s;
        opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};

        :hover {
          transition: all 0.3s ease-in-out !important;
          transform: none;
        }
      }
    }
  }
  .ud-btn {
    width: 100%;
    min-height: 48px;

    padding: 0;
    border-radius: 16px;
    margin-bottom: 16px;

    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("/images/unstoppable/default.svg");
    background-position: center;

    visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};

    :hover {
      background-image: url("/images/unstoppable/hover.svg");
    }
    :active {
      background-image: url("/images/unstoppable/pressed.svg");
    }
  }
`;

export default ConnectButtonStyled;
