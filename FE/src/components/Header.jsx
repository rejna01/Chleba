import React from "react";
import { useLocation, Link } from "react-router-dom";
import Styles from "./Header.module.css";

export default function Header() {
  const location = useLocation();
  const [pageHeader, setPageHeader] = React.useState("Home");
  const [scrolled, setScrolled] = React.useState(false);
  const [headerBackground, setHeaderBackground] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false); // nový stav menu

  React.useEffect(() => {
    const handleScroll = () => {
      setIsMenuOpen(false);
      const offset = window.scrollY;
      if (offset > 50) {
        setHeaderBackground(true);
        setScrolled(true);
      } else {
        setHeaderBackground(false);
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  React.useEffect(() => {
    setHeaderBackground(false);
    if (location.pathname === "/") {
      setPageHeader("Domů");
    } else if (location.pathname === "/archive") {
      setPageHeader("Archive");
    } else {
      setPageHeader("Stories");
    }

    // Zavřeme menu při změně URL, aby menu nezůstalo otevřené
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Toggle funkce na kliknutí hamburgeru
  const toggleMenu = () => {
    setHeaderBackground(isMenuOpen ? scrolled : !isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={headerBackground ? Styles.myHeader.scrolled : Styles.myHeader}
    >
      <Link to="/">
        <img className="headerChleba" src="/chleba_icon.png" alt="Logo" />
      </Link>
      <p className="headerText">{pageHeader}</p>

      {/* Hamburger tlačítko */}
      <button
        onClick={toggleMenu}
        className="hamburgerButton"
        aria-label="Toggle menu"
      >
        &#9776; {/* Unicode pro tři čárky */}
      </button>

      {/* Dropdown menu */}

      <nav
        className={
          isMenuOpen ? Styles.dropdownMenu : Styles.dropdownMenu.hidden
        }
      >
        <Link to="/">Domů</Link>
        <Link to="/archive">Archiv</Link>
        <Link to="/posts">Stories</Link>
        <Link to="/contact">Kontakty</Link>
        <Link to="/notes">Poznámky</Link>
      </nav>
    </header>
  );
}
