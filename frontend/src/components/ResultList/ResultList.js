import React, { useEffect, useState } from "react";
import MovieDetail from "../MovieDetail/MovieDetail";
import "./ResultList.css";
import usePost from "../../customHooks/usePost";
import axios from "axios";

function ResultList({ isSearch, bodySearch ,isShowMovieDetail, setIsShowMovieDetail}) {
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  console.log("🚀 ~ file: ResultList.js:10 ~ ResultList ~ results:", results)
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    const postData = async () => {
      setIsLoading(true);
      try {
        const data = await axios.post(
          `http://localhost:3001/api/movies/search`,
          { ...bodySearch},
          {
            headers: {
              Authorization: `Bearer RYoOcWM4JW`,
            },
          }
        );
        if (data.status === 200) {
          setResults(data.data.results);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    postData()
  }, [bodySearch]);

  const handleShowDetails = (movie) => {
    setIsShowMovieDetail(!isShowMovieDetail);
    setMovie(movie);
  };
  const totalPage = results?.total_pages;
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };
  return (
    <div className="resultList">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="resultContainer">
          {isSearch &&
            results?.map((movie) => {
              return (
                <>
                  <div className="resultItem" key={movie.name}>
                    <img
                      src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
                      alt={movie.title || movie.name}
                      className="resultPoster"
                      onClick={() => handleShowDetails(movie)}
                    />
                  </div>
                </>
              );
            })}
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
              isBannerList={false}
            />
          }
        </div>
      )}
    </div>
  );
}

export default ResultList;
{
  /* <svg
className="svg-inline--fa fa-search fa-w-16"
fill="#ccc"
aria-hidden="true"
data-prefix="fas"
data-icon="search"
width={200}
height={200}
role="img"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 512 512"
onClick={handleSearch}
>
<path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
</svg> */
}
