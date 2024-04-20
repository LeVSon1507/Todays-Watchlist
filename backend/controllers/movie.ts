import { Request, Response, NextFunction } from 'express';
import { Movie, Genre, VideoListIf, Video, Movies, GenreInterface, Videos } from '../models/Movies';
import { getPagingParams, getTotalPages } from '../utils/paging';

const movieList = Movies.all();
const genreList = Genre.all();
const videoList = Videos.all();



// Function to get trending movies
function getTrendingMovies(req: Request, res: Response, next: NextFunction): void {
   try {
      const { currentPage, offset, limit } = getPagingParams(req);

      const movies = [...movieList]
         .sort((a: Movie, b: Movie) => b.popularity - a.popularity)
         .slice(offset, offset + limit);

      const totalMovies = movieList.length;
      const totalPages = getTotalPages(totalMovies);

      res.status(200).json({
         results: movies,
         page: currentPage,
         total_pages: totalPages,
      });
   } catch (error) {
      next(error);
   }
}

// Function to get top rated movies
function getTopRateMovies(req: Request, res: Response, next: NextFunction): void {
   try {
      const { currentPage, offset, limit } = getPagingParams(req);

      const movies = [...movieList]
         .sort((a: Movie, b: Movie) => b.vote_average - a.vote_average)
         .slice(offset, offset + limit);

      const totalMovies = movieList.length;
      const totalPages = getTotalPages(totalMovies);

      res.status(200).json({
         results: movies,
         page: currentPage,
         total_pages: totalPages,
      });
   } catch (error) {
      next(error);
   }
}

// Function to get movies by genre
function getGenreMovies(req: Request, res: Response, next: NextFunction): void {
   try {
      const { currentPage, offset, limit } = getPagingParams(req);

      const genreId = parseInt(req.query.genre as string);
      if (!genreId) {
         res.status(400).json({ message: 'Not found genre param' });
         return;
      }

      const selectedGenre = genreList.find((gen: GenreInterface) => gen.id === genreId);
      if (!selectedGenre) {
         res.status(400).json({ message: 'Not found that genre id' });
         return;
      }

      const movies = [...movieList]
         .filter((movie: Movie) => movie.genre_ids.includes(genreId))
         .slice(offset, offset + limit);

      const totalMovies = movieList.length;
      const totalPages = getTotalPages(totalMovies);

      res.status(200).json({
         results: movies,
         page: currentPage,
         total_pages: totalPages,
         genre_name: selectedGenre.name,
      });
   } catch (error) {
      next(error);
   }
}

// Function to get movie trailer
function getMovieTrailer(req: Request, res: Response, next: NextFunction): void {
    try {
       const filmId = parseInt(req.body.film_id);
       if (!filmId) {
         res.status(400).json({ message: 'Missing or invalid film_id parameter' });
         return;
       }
 
       const videos = videoList.find((v: VideoListIf) => v.id === filmId)?.videos || [];
       const trailers = videos.filter(
          (v: Video) => v.official && v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
       );
 
       if (trailers.length === 0) {
          res.status(404).json({ message: 'No trailer found for this movie' });
          return;
       }
       //ưu tiên trailer hơn
         trailers.sort((a: Video, b: Video) => {
         if (a.type === 'Trailer' && b.type === 'Teaser') {
           return -1;
         } else if (a.type === 'Teaser' && b.type === 'Trailer') {
           return 1;
         } else {
           return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
         }
       })[0];

       const latestTrailer = trailers[0];

       res.status(200).json({ results: latestTrailer });
    } catch (error) {
       next(error);
    }
 }



 // Function to validate search parameters
function validateSearchParams(
    keyword: string,
    genre: string | null,
    mediaType: string | null,
    language: string | null,
    year: number | null
  ): string[] {
    const errors: string[] = [];
  
    // Check if keyword is missing or empty
    if (!keyword) {
      errors.push('Missing or empty keyword parameter');
    }
  
    // Check if genre parameter is invalid
    if (genre !== null && !genreList.some((g:GenreInterface) => g.name.trim().toLowerCase() === genre)) {
      errors.push('Invalid genre parameter');
    }
  
    // Check if mediaType parameter is invalid
    if (mediaType !== null && !['movie', 'tv'].includes(mediaType.trim().toLowerCase())) {
      errors.push('Invalid mediaType parameter');
    }
  
    // Check if language parameter is invalid
    if (language !== null && !movieList.some((m:Movie) => m.original_language.trim().toLowerCase() === language)) {
      errors.push('Invalid language parameter');
    }
  
    // Check if year parameter is invalid
    if (year !== null && (year < 1800 || year > new Date().getFullYear())) {
      errors.push('Invalid year parameter');
    }
  
    return errors;
  }
  
function searchMovies(req: Request, res: Response, next: NextFunction): void {
    try {
       const { currentPage, offset, limit } = getPagingParams(req);
 
       const keyword = req.body.keyword?.trim().toLowerCase() || '';
       const genre = req.body.genre?.trim().toLowerCase() || null;
       const mediaType = req.body.mediaType?.trim().toLowerCase() || null;
       const language = req.body.language?.trim().toLowerCase() || null;
       const year = req.body.year ? parseInt(req.body.year) : null;
 
       const errors: string[] = validateSearchParams(keyword, genre, mediaType, language, year);
       if (errors.length > 0) {
           res.status(400).json({ message: errors } );
           return;
       }
 
       const filteredMovies = movieList.filter((movie: Movie) => {
          // Search by keyword
          const isMatchKeyword =
             movie.title?.trim().toLowerCase().includes(keyword) ||
             movie.overview?.trim().toLowerCase().includes(keyword);
 
          // Search by genre
          const isMatchGenre = genre
             ? movie.genre_ids.includes(
                  genreList.find((g: GenreInterface) => g.name.trim().toLowerCase() === genre)?.id || -1
               )
             : true;
 
          // Search by media type
          const isMatchMediaType = mediaType
             ? movie.media_type.trim().toLowerCase() === mediaType
             : true;
 
          // Search by language
          const isMatchLanguage = language
             ? movie.original_language.trim().toLowerCase() === language
             : true;
 
          // Search by year
          const isMatchYear = year ? new Date(movie.release_date).getFullYear() === year : true;
 
          return (
             isMatchKeyword &&
             isMatchGenre &&
             isMatchMediaType &&
             isMatchLanguage &&
             isMatchYear
          );
       });
 
       const totalMovies = filteredMovies.length;
       const totalPages = getTotalPages(totalMovies);
 
       res.status(200).json({
          results: filteredMovies.slice(offset, offset + limit),
          page: currentPage,
          total_pages: totalPages,
       });
    } catch (error) {
       next(error);
    }
 }

 
 export { getTrendingMovies, getTopRateMovies, searchMovies, getMovieTrailer, getGenreMovies };
 