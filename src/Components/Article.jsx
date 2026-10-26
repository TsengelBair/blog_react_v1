import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const Article = ({ src }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
       fetch(src)
         .then((res) => {
           if (!res.ok) throw new Error(`Не удалось загрузить ${src}`);
           return res.text();
       }) 
       .then(setContent)
       .catch((err) => setError(err.message))
       .finally(() => setLoading(false));
    }, [src]);

    if (loading) return <p className="md-status">Загрузка…</p>;
    if (error) return <p className="md-status md-status--error">{error}</p>;

    return (
        <div className="md-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}

export default Article;