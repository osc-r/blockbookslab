import Image from "next/image";
import Link from "next/link";
import { HeaderStyled, NavStyled } from "./HeaderStyled";

const Logo = ({
  iconSize = 72,
  textSize = 24,
  displayText = true,
}: {
  iconSize?: number;
  textSize?: number;
  displayText?: boolean;
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", float: "left" }}>
      <Image
        layout="fixed"
        alt="blockbooks-logo"
        src={"/images/blockbooks.svg"}
        width={iconSize}
        height={iconSize}
        className="logo"
      />
      {displayText && (
        <div
          style={{
            color: "black",
            fontFamily: "Rubik",
            fontWeight: 400,
            letterSpacing: 0.4,
            fontSize: textSize,
          }}
        >
          BlockBooks
        </div>
      )}
    </div>
  );
};

const Header = () => (
  <HeaderStyled>
    <Logo />
    <NavStyled>
      <ul>
        <li>
          <Link href="/">
            <a>ABOUT</a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>HOW IT WORKS</a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>CONTACT</a>
          </Link>
        </li>
      </ul>
    </NavStyled>
  </HeaderStyled>
);

export { Logo };

export default Header;
