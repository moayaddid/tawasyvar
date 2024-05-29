import { useEffect, useRef, useState } from "react";
import { BiDownArrowAlt } from "react-icons/bi";
import { BsArrowDown } from "react-icons/bs";

function DropDownSearch({ data, title, selectItem , show , get , id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [Results, setResults] = useState(data);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = data.filter((item) => {
        return item[show].toLowerCase().includes(term);
    });
    setResults(results);
  };

  function onSelectItem(item) {
    selectItem(item);
    setSelectedItem(item[show]);
    setIsOpen(false);
  }

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      id={id}
      className=" relative  w-full border-b-2 border-gray-300"
      ref={dropdownRef}
    >
      <div
        onClick={() => {
          setIsOpen(true);
        }}
        className=" w-full cursor-pointer flex justify-between items-center"
      >
        {selectedItem ? (
          <p className="text-black">{selectedItem}</p>
        ) : (
          <p className="text-gray-400">{title}</p>
        )}
        <BiDownArrowAlt className="w-[20px] h-[20px]" />
      </div>
      {isOpen == true && (
        <div className="absolute -top-100 right-0 z-[99] left-0 bg-white px-2 py-1 border rounded-lg border-skin-primary ">
          <div className="w-full max-h-[300px] flex flex-col justify-start items-center space-y-2">
            <input
              className=" w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {Results &&
              (Results.length > 0 ? (
                <div className="flex flex-col justify-start items-start w-full overflow-scroll">
                  {Results.map((result, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          onSelectItem(result);
                        }}
                        className="text-gray-400 cursor-pointer hover:bg-gray-100 w-full hover:text-skin-primary text-ellipsis text-start"
                      >
                        {result[show]}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center">There no results</p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DropDownSearch;
