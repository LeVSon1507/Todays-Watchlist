import React, { useState } from "react";
import useFetch from "../../customHooks/useFetch";
import Slider from "react-slick";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MovieList.css";
import MovieDetail from "../MovieDetail/MovieDetail";

function MovieList({ apiEndpoint, isOriginal, genre }) {
  const [page, setPage] = useState(1);
  const { results, isLoading } = useFetch(
    apiEndpoint,
    `page=${page}&genre=${genre}`
  );
  const totalPage = results?.total_pages;
  const [isShowMovieDetail, setIsShowMovieDetail] = useState(false);
  const [isBannerList, setIsBannerList] = useState(false);
  const [movie, setMovie] = useState({});

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 9,
    slidesToScroll: 5,
    // autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
  };
  const handleShowDetails = (movie, isOriginal) => {
    setIsShowMovieDetail(!isShowMovieDetail);
    setMovie(movie);
    setIsBannerList(isOriginal);
  };
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };
  return (
    <div className="movieList">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <Slider {...settings}>
          {results?.results?.map((movie) => {
            return (
              <div className="movieItem" key={movie.id}>
                {isOriginal ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="movieImgPoster"
                    onClick={() => handleShowDetails(movie, isOriginal)}
                  />
                ) : (
                  <img
                    src={`https://image.tmdb.org/t/p/w185/${movie.backdrop_path}`}
                    alt={movie.title || movie.name}
                    className="movieImgBackDrop"
                    onClick={() => handleShowDetails(movie, isOriginal)}
                  />
                )}
              </div>
            );
          })}
        </Slider>
      )}
      <div className="btn-next-prev">
        {page > 1 && (
          <button className="btn-page" onClick={handlePrevPage}>
            Prev
          </button>
        )}
        {page <= totalPage - 1 && (
          <button className="btn-page" onClick={handleNextPage}>
            Next
          </button>
        )}
      </div>
      {
        <MovieDetail
          isShowMovieDetail={isShowMovieDetail}
          movieData={movie}
          isBannerList={isBannerList}
        />
      }
    </div>
  );
}

export default MovieList;
