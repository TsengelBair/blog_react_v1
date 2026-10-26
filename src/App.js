import { useEffect, useState } from "react";
import "./css/styles.css"

import { CATEGORY_SLUGS } from "./categories";

import Header from "./Components/Header";
import ArticlePreview from "./Components/ArticlePreview";
import Pagination from "./Components/Pagination";
import Article from "./Components/Article";

const PER_PAGE = 10;

/*
  activeCategory - текущая активная категория (получаем из хэдера)
  currentSrc - текущий путь до статьи (если null, значит открыты preview статей, отфильтрованные или нет не важно, здесь только путь до статьи)
      |
  по сути индикатор, что статья открыта)
*/

function App() {
  const [articlesPreviewData, setArticlesPreviewData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentSrc, setCurrentSrc] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/data/preview_data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Не удалось загрузить статьи");
      return res.json();
    })
    .then(setArticlesPreviewData)
    .catch((err) => setError(err.message))
    .finally(setLoading(false));
  }, []);
  /*
    Подписываемся на popstate, чтобы при навигации браузера («назад/вперёд») синхронизировать состояние (currentSrc, activeCategory) с URL:
      1) получаем текущий URL (полученный после перемещения)
      2) если это статья, обновляем currentSrc и проверяем была ли статья открыта с предварительной фильтрацией, чтобы восстановить выбранный фильтр
  */
  useEffect(() => {
    const onPop = () => {
      // путь до статьи (если открыта не статья - то просто `/`)
      const path = window.location.pathname;                      // пример: /articles/math-primes
      // категория (если есть, если нет то ничего)
      const params = new URLSearchParams(window.location.search); // пример: category=math

      const articleMatch = path.match(/^\/articles\/([^/]+)$/);
      if (articleMatch) {
        setCurrentSrc(`/articles/${articleMatch[1]}.md`);
        
        const cat = params.get("category");
        setActiveCategory(cat && CATEGORY_SLUGS.includes(cat) ? cat : null);

        return;
      }

      const categoryMatch = path.match(/^\/([^/]+)$/);
      if (categoryMatch && CATEGORY_SLUGS.includes(categoryMatch[1])) {
        setCurrentSrc(null);                         
        setActiveCategory(categoryMatch[1]);
      } else {
        setCurrentSrc(null);
        setActiveCategory(null);
      }

      const p = parseInt(params.get("page"), 10);
      setPage(p > 0 ? p : 1);
    }

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /*
    клик по категории означает, что нужно отобразить все статьи в preview, а значит выйти из текущей фул версии статьи (если открыта), поэтому setCurrentSrc(null)
  */
  const toggleCategory = (slug) => {
    const next = activeCategory === slug ? null : slug;
    setActiveCategory(next);
    setCurrentSrc(null);
    setPage(1);
    window.history.pushState({}, "", next ? `/${next}` : "/"); // pushState — меняет URL без перезагрузки, добавляет запись в историю
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const openArticle = (src) => {
    const slug = src.replace(/^\/articles\//, "").replace(/\.md$/, ""); // из src ("/articles/loop_tmp.md") получить slug ("loop_tmp") — для URL.
    setCurrentSrc(src);                                           // "/articles/loop_tmp.md"

    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);

    const query = params.toString();
    window.history.pushState(
      {},
      "",
      query ? `/articles/${slug}?${query}` : `/articles/${slug}`
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const goToPage = (n) => {
    setPage(n);

    const params = new URLSearchParams();
    if (n > 1) params.set("page", n);

    const query = params.toString();
    const base = activeCategory ? `/${activeCategory}` : "/";

    window.history.pushState({}, "", query ? `${base}?${query}` : base);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="App">
        <div className="container">
            <Header
              activeCategory={activeCategory}
              onCategoryClick={toggleCategory}
            />
            <p className="status">Загрузка…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="container">
            <Header
              activeCategory={activeCategory}
              onCategoryClick={toggleCategory}
            />
            <p className="status status--error">{error}</p>
        </div>
      </div>
    );
  }

  if (currentSrc !== null) {
    return (
      <div className="App">
        <div className="container">
            <Header
              activeCategory={activeCategory}
              onCategoryClick={toggleCategory}
            />
            <Article src={currentSrc}/>
        </div>
      </div>
    );
  }

  /* оставляем только тематические статьи (includes, т.к. одна статья может относиться к нескольким темам) */
  const filtered = activeCategory 
  ? articlesPreviewData.filter((a) => a.categories.includes(activeCategory))
  : articlesPreviewData;

  /* вычисляем кол-во страниц и берем срез, чтобы отобразить нужные статьи в зависимости от выбранной страницы */
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const visible = filtered.slice(start, end);

  return (
    <div className="App">
      <div className="container">
        <Header
          activeCategory={activeCategory}
          onCategoryClick={toggleCategory}
        />
        <main className="articles">
          {visible.map((a) => (
            <ArticlePreview
              key={a.id}
              title={a.title}
              date={a.date}
              image={a.image}
              text={a.text}
              src={a.contentFile}
              onOpen={openArticle}
            />
          ))}
        </main>
        <Pagination 
          page={page}
          totalPages={totalPages}
          onChange={goToPage}
        />
      </div>
    </div>
  );
}

export default App;
