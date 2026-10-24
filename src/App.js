import { useState } from "react";
import "./css/styles.css"

import Header from "./Components/Header";

function App() {
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (slug) => {
    const next = activeCategory === slug ? null : slug;
    setActiveCategory(next);
  }

  return (
    <div className="App">
        <div className="container">
            <Header
              activeCategory={activeCategory}
              onCategoryClick={toggleCategory}
            />
        </div>
    </div>
  );
}

export default App;
