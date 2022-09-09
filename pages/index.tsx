import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header/Header";
import HomeContainer, { LaunchAppButton, Section } from "./homeStyled";
import { useRouter } from "next/router";
import Arrow from "../public/images/launchApp.svg";
import Icon from "../public/images/whatIsThis.svg";
import FireIcon from "../public/images/fireIcon.svg";
import Supporters from "../public/images/supporters.svg";
import Planner from "../public/images/noIdeaWhatIsThis.svg";
import ReportIcon from "../public/images/reportIcon.svg";
import PlanIcon from "../public/images/planIcon.svg";

const Home: NextPage = () => {
  const router = useRouter();

  const onClickLaunchApp = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/app");
  };

  return (
    <HomeContainer>
      <Section padding>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 1200,
            height: "100%",
            alignSelf: "center",
          }}
        >
          <Header />
          <div
            style={{
              marginTop: 64,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{}}>
              <div
                style={{
                  fontFamily: "Bai Jamjuree",
                  fontWeight: 700,
                  color: "black",
                  fontSize: 86,
                  lineHeight: "80px",
                }}
              >
                <div>Accounting</div>
                <div>made easy</div>
              </div>
              <div
                style={{ color: "#535354", lineHeight: "24px", marginTop: 48 }}
              >
                <div>One-stop service financial management</div>
                <div>for Web 3.0 companies</div>
              </div>
              <LaunchAppButton onClick={onClickLaunchApp}>
                <Arrow className="arrow" />
                Launch App
              </LaunchAppButton>
            </div>
            <Image
              alt="dashboard"
              src={"/images/dashboard.svg"}
              width={650}
              height={400}
              style={{}}
            />
          </div>

          <div
            style={{
              color: "black",
              display: "flex",
              marginTop: "auto",
              marginBottom: 78,
            }}
          >
            <div
              style={{
                flex: 1.7,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <span
                style={{
                  fontFamily: "Bai Jamjuree",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#222223",
                }}
              >
                <div>
                  Invest <FireIcon />
                </div>
                <div>on us now</div>
              </span>
              <br />
              <span
                style={{
                  marginTop: 18,

                  fontFamily: "Roboto",
                  color: "#5F5F64",
                  letterSpacing: "0.01em",
                }}
              >
                <div>We are looking for 10 M </div>
                <div>investment for Series A</div>
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <Icon className="icon" />
              <div
                style={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#17181A",
                  marginBottom: 18,
                }}
              >
                Save cost and time
              </div>
              <br />
              <span
                style={{
                  fontFamily: "Roboto",
                  color: "#5F5F64",
                  letterSpacing: "0.01em",
                }}
              >
                <div>We are faster, cheaper, </div>
                <div>and more precise</div>
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <Icon className="icon" />
              <div
                style={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#17181A",
                  marginBottom: 18,
                }}
              >
                3-month trials
              </div>
              <br />
              <span
                style={{
                  fontFamily: "Roboto",
                  color: "#5F5F64",
                  letterSpacing: "0.01em",
                }}
              >
                <div>We encourage you all to </div>
                <div>try out our products</div>
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <Icon className="icon" />
              <div
                style={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#17181A",
                  marginBottom: 18,
                }}
              >
                Know your money
              </div>
              <br />
              <span
                style={{
                  fontFamily: "Roboto",
                  color: "#5F5F64",
                  letterSpacing: "0.01em",
                }}
              >
                <div>Managing finance within</div>
                <div>the company is now easy</div>
              </span>
            </div>
          </div>
        </div>
      </Section>
      <div className="bg">
        <div className="circle"></div>
        <div
          className="wrap"
          style={{
            display: "flex",
            width: 826,
            justifyContent: "space-between",
            marginTop: 64,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Bai Jamjuree",
                fontSize: 30,
                fontWeight: 500,
                color: "#202020",
              }}
            >
              <div>We support Buidlers</div>
              in Web 3.0 space
            </div>
            <div
              style={{
                fontFamily: "Roboto",
                fontWeight: 400,
                letterSpacing: "0.02em",
                color: "#5F5F64",
                marginTop: 16,
              }}
            >
              <div>Buidlers should focus on buildings</div>
              not administrative stuff
            </div>
          </div>
          <div>
            <span
              style={{
                fontFamily: "Bai Jamjuree",
                fontSize: 30,
                fontWeight: 500,
                color: "#202020",
              }}
            >
              <div>Social Media</div>
              beyond probability
            </span>
            <div
              style={{
                fontFamily: "Roboto",
                fontWeight: 400,
                letterSpacing: "0.02em",
                color: "#5F5F64",
                marginTop: 16,
              }}
            >
              <div>Essentially a formula for how a</div>
              business is going to compete,
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <div
        style={{
          background: "linear-gradient(0, #E5E5E5 0%, #FAFAFA 50%, white 80%)",
        }}
      >
        <div
          className="partner"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            marginBottom: 108,
          }}
        >
          <div
            style={{
              fontFamily: "Bai Jamjuree",
              fontSize: 80,
              color: "#0D1111",
              marginBottom: 20,
            }}
          >
            7+ Global Supporters
          </div>
          <Supporters />
          <div
            style={{
              display: "flex",
              width: 1090,
              height: 210,

              marginTop: 32,
              borderStyle: "solid",
              borderWidth: 1,
              borderImage:
                "linear-gradient(to left, transparent, #BCC3BD, transparent) 1",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                borderRight: "1.4px solid #BCC3BD",
              }}
            >
              <div
                style={{
                  marginBottom: 12,
                  fontFamily: "Inter",
                  fontWeight: 500,
                  color: "#718176",
                  letterSpacing: "0.4em",
                }}
              >
                FEATURES
              </div>
              <div
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 500,
                  color: "black",
                  fontSize: 24,
                }}
              >
                100+
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                borderRight: "1.4px solid #BCC3BD",
              }}
            >
              <div
                style={{
                  marginBottom: 12,
                  fontFamily: "Inter",
                  fontWeight: 500,
                  color: "#718176",
                  letterSpacing: "0.4em",
                }}
              >
                TAM
              </div>
              <div
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 500,
                  color: "black",
                  fontSize: 24,
                }}
              >
                524 B
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                borderRight: "1.4px solid #BCC3BD",
              }}
            >
              <div
                style={{
                  marginBottom: 12,
                  fontFamily: "Inter",
                  fontWeight: 500,
                  color: "#718176",
                  letterSpacing: "0.4em",
                }}
              >
                SAM
              </div>
              <div
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 500,
                  color: "black",
                  fontSize: 24,
                }}
              >
                1.2 B
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <div
                style={{
                  marginBottom: 12,
                  fontFamily: "Inter",
                  fontWeight: 500,
                  color: "#718176",
                  letterSpacing: "0.4em",
                }}
              >
                SOM
              </div>
              <div
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 500,
                  color: "black",
                  fontSize: 24,
                }}
              >
                120 M
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            color: "black",
            display: "flex",
            justifyContent: "center",

            paddingBottom: 180,
          }}
        >
          <Planner />
          <div
            style={{ marginLeft: 12, display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                fontFamily: "Bai Jamjuree",
                fontWeight: 600,
                fontSize: 52,
                color: "#192430",
              }}
            >
              <div>Handoff your work</div> smarter now
            </div>
            <div
              style={{
                fontFamily: "Roboto",
                fontWeight: 400,
                color: "#727272",
                marginTop: 32,
                marginBottom: 64,
              }}
            >
              <div>Transactions are well-organized and no more</div> tedious
              excel works
            </div>

            <div style={{ display: "flex", marginBottom: 32 }}>
              <ReportIcon />
              <div style={{ marginLeft: 32 }}>
                <div
                  style={{
                    fontFamily: "Bai Jamjuree",
                    fontWeight: 600,
                    fontSize: 20,
                    color: "#222222",
                  }}
                >
                  Report
                </div>
                <div
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    color: "#727272",
                    marginTop: 12,
                  }}
                >
                  <div>Data analytics tools and financial reports</div>are
                  ready-made
                </div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <PlanIcon />
              <div style={{ marginLeft: 32 }}>
                <div
                  style={{
                    fontFamily: "Bai Jamjuree",
                    fontWeight: 600,
                    fontSize: 20,
                    color: "#222222",
                  }}
                >
                  Plan
                </div>
                <div
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    color: "#727272",
                    marginTop: 12,
                  }}
                >
                  <div>better plan your financial activites within</div>company
                  with an ease
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          height: 522,
          backgroundColor: "#8DD911",
          backgroundImage: "url(/images/transferComponent.svg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "100%",
        }}
      >
        {/* <TransferImage/> */}
      </div>
    </HomeContainer>
  );
};

export default Home;
