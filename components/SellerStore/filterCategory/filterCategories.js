import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';


function FilterCategories({ categories, selectedCategory, onSelectCategory }) {

  const categoriesRef = useRef();

  useEffect(() => {
    const selectedCat = document.getElementById(
      `${selectedCategory}`
    );
    const container = categoriesRef.current;
    if (selectedCat && container) {
      selectedCat.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
        container,
      });
    }
  }, [selectedCategory , onSelectCategory]);

  return (
    <div className="flex px-2 justify-start items-center space-x-4 w-max " ref={categoriesRef}>
      {categories.map((category) => (
        <button
          key={category.name}
          id={category.name}
          className={`px-2 py-2 focus:outline-none w-max ${
            selectedCategory === category.name ? 'border-b-2 border-skin-primary text-skin-primary' : 'bg-gray-200'
          }`}
          onClick={() => onSelectCategory(category.name)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default FilterCategories;
