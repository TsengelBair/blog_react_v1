/*
    Отображаем список тем, которые берем из categories.js
    Через пропсы передаем активную категорию и коллбэк для обработки клика по категории (обработаем в App.js)
    Переданной активной категории просто добавляем css класс nav__link--active, которые добавит в ui выделение
    Передаем articles (данные превью), т.к. поиск осуществляем по заголовку и краткому описанию статьи
    onSearchSelect - коллбэк для обработки нажатия на выбранную статью, чтобы открыть статью
    onSearchClicked - коллбэк для обработки нажатия на кнопку Найти, чтобы отобразить все подходящие статьи в App.js
*/

import { useState } from "react";
import { CATEGORIES } from "../categories";

const Header = ({
  activeCategory,
  onCategoryClick,
  articles,
  onSearchSelect,
  onSearchClicked,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();
  const matches = query
    ? articles.filter((a) => a.title.toLowerCase().includes(query)).slice(0, 8) // TODO:: добавить слайдер (когда статей станет много грузить больше 8)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchClicked(searchQuery.trim()); 
  };

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__brand">
          <h1 className="header__title">Dev Notes</h1>
          <p className="header__subtitle">Заметки программиста</p>
        </div>

        <search className="header__search">
          <form className="header__search-form" onSubmit={handleSubmit}>
            <div className="header__search-wrap">
              <input
                className="header__search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск статей…"
                aria-label="Поиск статей"
              />

              {query && (
                <ul className="search-dropdown">
                  {matches.length === 0 ? (
                    <li className="search-dropdown__empty">Ничего не найдено</li>
                  ) : (
                    matches.map((a) => (
                      <li key={a.id}>
                        <button
                          type="button"
                          className="search-dropdown__item"
                          onClick={() => {
                            setSearchQuery("");
                            onSearchSelect(a.contentFile);
                          }}
                        >
                          {a.title}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <button className="header__search-btn" type="submit">Найти</button>
          </form>
        </search>
      </div>

      <nav className="nav" aria-label="Основная навигация">
        <ul className="nav__list">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <button
                type="button"
                className={`nav__link ${activeCategory === cat.slug ? "nav__link--active" : ""}`}
                onClick={() => onCategoryClick(cat.slug)}
                aria-pressed={activeCategory === cat.slug}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;