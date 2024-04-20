import React from 'react';
import Banner from '../../components/Banner/Banner';
import MovieList from '../../components/MovieList/MovieList';
import NavBar from '../../components/NavBar/NavBar';
import { requests } from '../../requestsApi';
import './Browse.css';
import useFetch from '../../customHooks/useFetch';
import CircularProgress from '@mui/material/CircularProgress';

function Browse() {
   const { results } = useFetch('/discover', `page=${1}`);

   return !!results ? (
      <div className='loadingContainer'>
         <div class='loader'></div>
      </div>
   ) : (
      <div className='browseContainer'>
         <NavBar />
         <Banner apiEndpoint={`/discover`} />
         <MovieList apiEndpoint={`/discover`} isOriginal />

         <h3>Xu Hướng</h3>
         <MovieList apiEndpoint={'/trending'} />

         <h3>Xếp hạng cao</h3>
         <MovieList apiEndpoint={'/top-rate'} />

         <h3>Hành động</h3>
         <MovieList apiEndpoint={'/discover'} genre={28} />

         <h3>Hài</h3>
         <MovieList apiEndpoint={'/discover'} genre={35} />

         <h3>Kinh dị</h3>
         <MovieList apiEndpoint={'/discover'} genre={27} />

         <h3>Lãng mạng</h3>
         <MovieList apiEndpoint={'/discover'} genre={10749} />

         <h3>Tài liệu</h3>
         <MovieList apiEndpoint={'/discover'} genre={99} />
      </div>
   );
}

export default Browse;
