import React, { useState } from 'react';
import './Search.css';
import NavBar from '../../components/NavBar/NavBar';
import SearchForm from '../../components/SearchForm/SearchForm';
import ResultList from '../../components/ResultList/ResultList';

const Search = () => {
   const [isSearch, setIsSearch] = useState(false);
   const [bodySearch, setBodySearch] = useState({});
   const [isShowMovieDetail, setIsShowMovieDetail] = useState(false);

   return (
      <div className='searchContainer'>
         <NavBar />
         <SearchForm
            setIsSearch={setIsSearch}
            setBodySearch={setBodySearch}
            setIsShowMovieDetail={setIsShowMovieDetail}
         />
         <h2>Search Result</h2>
         <ResultList
            isSearch={isSearch}
            bodySearch={bodySearch}
            isShowMovieDetail={isShowMovieDetail}
            setIsShowMovieDetail={setIsShowMovieDetail}
         />
      </div>
   );
};

export default Search;
