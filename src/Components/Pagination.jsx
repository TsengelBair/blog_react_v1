const Pagination = ({ page, totalPages, onChange }) => {
    if (totalPages <= 1) return;

    const pages = Array.from({ legnth: totalPages }, (_, i) => i + 1);

    return (
        <nav className="pagination" aria-label="Страницы">
            <button
                type="button"
                className="pagination__btn"
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
            >
                ← Назад
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
                    onClick={() => onChange(p)}
                    aria-current={p === page ? "page" : undefined}
                    >
                    {p}
                </button>
            ))}

            <button
                type="button"
                className="pagination__btn"
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
            >
                Вперёд →
            </button>
        </nav>
  );
}

export default Pagination;