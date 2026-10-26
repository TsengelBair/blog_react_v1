const ArticlePreview = ({ title, date, image, text, src = "#", onOpen }) => {
  return (
    <article className="article">
      <header className="article__head">
        <h2 className="article__title">{title}</h2>
        <aside className="meta">
          <span className="date">{date}</span>
        </aside>
      </header>

      <div className="article__body">
        <img className="article__image" src={image} alt={title} />

        <div className="article__content">
          <p className="article__text">{text}</p>
          <a
            className="article__more"
            href={src}
            onClick={(e) => {
              // модификаторы — не перехватываем (открыть в новой вкладке)
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              onOpen(src);
            }}
          >
            Читать далее →
          </a>
        </div>
      </div>
    </article>
  );
};

export default ArticlePreview;