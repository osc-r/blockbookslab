import styled from "styled-components";

const HomeContainer = styled.div`
  .bg {
    height: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ece74450;

    margin-top: 54px;
    margin-bottom: 130px;
  }
  .wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .circle {
    width: 70px;
    height: 70px;
    position: relative;

    transform: translateY(-50%);

    ::after,
    ::before {
      content: "";
      top: 0;
      left: 0;
      right: 0;
      bottom: 50%;
      position: absolute;
      background-color: #ece744;
      border-top-left-radius: 110px;
      border-top-right-radius: 110px;
      border: 0px solid gray;
      border-bottom: 0;
    }

    ::after {
      right: 50%;
      bottom: 0;

      border-top-right-radius: 0px;
      border-top-left-radius: 110px;
      border-bottom-left-radius: 110px;
    }
  }

  .icon {
    margin-bottom: 32px;
  }
`;

const Section = styled.div<{ padding?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100vh;

  background-color: ${({ color, theme }) =>
    color ? color : theme.colors.primary};
`;

const LaunchAppButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 28px;
  margin-top: 64px;

  color: white;
  font-size: 16px;
  font-family: Rubik;
  background-color: #007574;
  box-shadow: 0px 10px 30px rgba(206, 206, 206, 0.6);
  border-radius: 30px;

  .arrow {
    margin-right: 22px;
  }
`;
export default HomeContainer;
export { Section, LaunchAppButton };
