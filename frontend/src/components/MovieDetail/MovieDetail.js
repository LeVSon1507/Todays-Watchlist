import React, { useEffect, useState } from "react";
import moment from "moment";
import YouTube from "react-youtube";
import "./MovieDetail.css";
import axios from "axios";
// import usePost from "../../customHooks/usePost";

function MovieDetail({ movieData, isShowMovieDetail, isBannerList }) {
  const {
    id,
    title,
    release_date,
    vote_average,
    backdrop_path,
    overview,
    poster_path,
    name,
  } = movieData;
  // const { results, isLoading } = usePost(
  //   "video",
  //   "RYoOcWM4JW",
  //   { film_id: id },
  //   id
  // ); 
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const postData = async () => {
      setIsLoading(true);
      try {
        const data = await axios.post(
          `http://localhost:3001/api/movies/video`,
          { film_id: id },
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
  }, [id, isShowMovieDetail]);

  const trailerMovie = results;;

  const opts = {
    height: "400",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    isShowMovieDetail && (
      <div className="movieDetails">
        <div className="movieDetailContainer">
          <h1 className="title">{isBannerList ? name : title}</h1>
          <div className="line"></div>
          <h4>Release Date: {moment(release_date).format("YYYY-MM-DD")}</h4>
          <h4 className="vote">Vote: {vote_average}/10</h4>
          <p>{overview}</p>
        </div>
        {isLoading && <h1>Loading...</h1>}
        {!isLoading && trailerMovie && (
          <div className="trailer">
            <YouTube videoId={trailerMovie.key} opts={opts} />
          </div>
        )}
        {!isLoading && !trailerMovie && (
          <img
            src={
              isBannerList
                ? `https://image.tmdb.org/t/p/original${poster_path}`
                : `https://image.tmdb.org/t/p/original${backdrop_path}`
            }
            alt="Backdrop"
            style={{ width: "100%" }}
          />
        )}
      </div>
    )
  );
}

export default MovieDetail;
