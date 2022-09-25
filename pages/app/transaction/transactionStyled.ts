import styled from "styled-components";

const TransactionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  padding-top: 54px;

  button {
    padding: 8px 16px;

    font-family: Rubik;
    font-weight: 400;
    color: #00c3c1;
    font-size: 16px;
  }

  button:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .action-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }
  .add-wallet-btn-l {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 12px;
    border: 2px dashed #00c3c1;
    border-radius: 16px;

    color: #00c3c1;
    letter-spacing: 0.4px;

    span {
      margin-top: 4px;
    }
  }
  .add-wallet-btn-m {
    border: 1px solid #19c9c7;
    border-radius: 10px;
    padding: 4px 12px;
    margin-left: 24px;

    color: white;
    background: #19c9c7;
  }
  .csv {
    margin-left: auto;
    max-width: 75px;
  }
`;

export default TransactionContainer;
