const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <p className="footer__copy">
            © {year} Dev Notes. Заметки программиста.
          </p>

          <nav className="footer__nav" aria-label="Навигация в подвале">
            <ul className="footer__list">
              {/* <li>
                <a className="footer__link" href="/about">Обо мне</a>
              </li>
              <li>
                <a className="footer__link" href="/contact">Контакты</a>
              </li>
              <li>
                <a className="footer__link" href="/rss.xml">RSS</a>
              </li> */}
              <li>
                <a
                  className="footer__link"
                  href="https://github.com/TsengelBair"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;