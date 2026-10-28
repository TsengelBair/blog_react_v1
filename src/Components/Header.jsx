/*
    Отображаем список тем, которые берем из categories.js
    Через пропсы передаем активную категорию и коллбэк для обработки клика по категории (обработаем в App.js)
    Переданной активной категории просто добавляем css класс nav__link--active, которые добавит в ui выделение
    Передаем articles (данные превью), т.к. поиск осуществляем по заголовку статьи (а все заголовки лежат в переданных articles)
    onSearchSelect - коллбэк для обработки нажатия на выбранную статью, чтобы открыть статью
    onSearchClicked - коллбэк для обработки нажатия на кнопку Найти, чтобы отобразить все подходящие статьи в App.js
*/

import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../categories";

const Header = ({ activeCategory, onCategoryClick, articles, onSearchSelect, onSearchClicked, searchQuery, onSearchChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  /*
    searchWrapRef - переменная, с одним полем current, которое указывает на реальный div в DOM
    сам div - это поле поиска с выпадающим списком и для его скрытия в ui необходимо отслеживать событие клика
    при клике вне этого div скрываем выпадающий список
  */
  const searchWrapRef = useRef(null);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown); 
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const matches = query
    ? articles.filter((a) => a.title.toLowerCase().includes(query))
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchClicked(searchQuery.trim());
    setShowDropdown(false);
  };

  const isDropdownVisible = showDropdown && query;

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__brand">
          <h1 className="header__title">Dev Notes</h1>
          <p className="header__subtitle">Заметки программиста</p>
        </div>

        <search className="header__search">
          <form className="header__search-form" onSubmit={handleSubmit}>
            <div className="header__search-wrap" ref={searchWrapRef}> 
              <input
                className="header__search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Поиск статей…"
                aria-label="Поиск статей"
              />

              {isDropdownVisible && (
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
                            onSearchChange("");
                            setShowDropdown(false);
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