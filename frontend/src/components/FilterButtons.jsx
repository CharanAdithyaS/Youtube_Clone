import './FilterButtons.css';

const CATEGORIES = ['All', 'Education', 'Tech', 'Gaming', 'Music', 'Entertainment', 'News'];

const FilterButtons = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="filter-buttons">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
