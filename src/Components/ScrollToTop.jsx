import { useEffect, useState } from "react"

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollUp = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return;
    return (
        <button
            type="button"
            className="scroll-top"
            onClick={scrollUp}
            aria-label="Наверх"
        >
            ↑
        </button>
    );
}

export default ScrollToTop;