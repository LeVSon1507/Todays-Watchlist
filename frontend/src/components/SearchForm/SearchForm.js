import React, { useCallback, useState } from "react";
import "./SearchForm.css";
import Select from "react-select";

function SearchForm({  setIsSearch,setBodySearch,setIsShowMovieDetail }) {
  const [genre, setGenre] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");
  const [searchValue, setSearchValue] = useState('');

  const handleSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const handleGenreChange = (selectedOption) => {
    setGenre(selectedOption?.value || "");
  };

  const handleMediaTypeChange = (selectedOption) => {
    setMediaType(selectedOption?.value || "");
  };

  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption?.value || "");
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSearch = () => {
    setIsSearch(true);
    setBodySearch({
      keyword: searchValue,
      genre: genre,
      mediaType: mediaType,
      language: language,
      year: year,
    });
  };

  const handleReset = () => {
    setIsSearch(false);
    setSearchValue("");
    setGenre("");
    setMediaType("");
    setYear("");
    setIsShowMovieDetail(false)
  };

  const mediaTypeOptions = [
    { value: "", label: "Select a media type" },
    { value: "all", label: "All" },
    { value: "movie", label: "Movie" },
    { value: "tv", label: "TV" },
    { value: "person", label: "Person" },
  ];

  const optionsGenre = [
    { value: "", label: "Select a genre" },
    { value: "Action", label: "Action" },
    { value: "Comedy", label: "Comedy" },
    { value: "Drama", label: "Drama" },
    { value: "Horror", label: "Horror" },
    { value: "Romance", label: "Romance" },
    { value: "Sci-Fi", label: "Sci-Fi" },
    { value: "Thriller", label: "Thriller" },
  ];

  const optionsLanguage = [
    { value: "", label: "Select a language" },
    { value: "en", label: "English" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
  ];
  return (
    <div className="searchForm">
      <div className="inputGr">
        <input
          type="text"
          className="searchInput"
          onChange={handleSearchValue}
          value={searchValue}
          placeholder="Search By Keyword"
        />
      </div>
      <div className="dropdownGr">
        {/* Dropdown cho trường genre */}
        <Select
          className="dropdown"
          options={optionsGenre}
          onChange={handleGenreChange}
          value={optionsGenre.find((option) => option.value === genre)}
        />
      </div>
      <div className="dropdownGr">
        {/* Dropdown cho trường media type */}
        <Select
          className="dropdown"
          options={mediaTypeOptions}
          onChange={handleMediaTypeChange}
          value={mediaTypeOptions.find((option) => option.value === mediaType)}
        />
      </div>
      <div className="dropdownGr">
        {/* Dropdown cho trường language */}
        <Select
          className="dropdown"
          options={optionsLanguage}
          onChange={handleLanguageChange}
          value={optionsLanguage.find((option) => option.value === language)}
        />
      </div>
      <div className="dropdownGr">
        {/* Trường input cho năm */}
        <input
          type="number"
          className="searchInput"
          onChange={handleYearChange}
          value={year}
          placeholder="Search By Year"
        />
      </div>
      <div className="btnSearchGr">
        <button className="resetBtn" onClick={handleReset}>
          RESET
        </button>
        <button className="searchBtn" onClick={handleSearch}>
          SEARCH
        </button>
      </div>
    </div>
  );
}

export default SearchForm;
