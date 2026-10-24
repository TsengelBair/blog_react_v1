/*
    Отображаем список тем, которые берем из categories.js
    Через пропсы передаем активную категорию и коллбэк для обработки клика по категории (обработаем в App.js)
    Переданной активной категории просто добавляем css класс nav__link--active, которые добавит в ui выделение
*/

import { CATEGORIES } from "../categories";

const Header = ({ activeCategory, onCategoryClick }) => {
    return (
        <header class="header">
            <div class="header__top">
                <div class="header__brand">
                    <h1 class="header__title">Dev Notes</h1>
                    <p class="header__subtitle">Заметки программиста</p>
                </div>
                <search class="header__search">
                    <form class="header__search-form" action="/search" method="get">
                        <input
                        class="header__search-input"
                        type="search"
                        name="q"
                        placeholder="Поиск статей…"
                        aria-label="Поиск статей"
                        />
                        <button class="header__search-btn" type="submit">Найти</button>
                    </form>
                </search>
            </div>
            <nav class="nav" aria-label="Основная навигация">
                <ul class="nav__list">
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
    )
}

export default Header;