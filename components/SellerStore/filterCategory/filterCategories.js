import Link from 'next/link';
import React, { useState } from 'react';


function FilterCategories({ categories, selectedCategory, onSelectCategory }) {

  return (
    <div className="flex px-2 justify-start items-center space-x-4 w-max ">
      {categories.map((category) => (
        <button
          key={category.name}
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
