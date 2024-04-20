import express, { Application, Request, Response, NextFunction, Router } from 'express';
import path from 'path';
import fs from 'fs';
import authenticateToken from '../userAuthorized';

interface Movie {
   id: number;
   title: string;
   overview: string;
   poster_path: string;
   release_date: Date;
   popularity: number;
   length: number;
   vote_average: number;
   genre_ids: [number];
   media_type: string;
   original_language: string;
}

interface Genre {
   id: number;
   name: string;
}
interface VideoListIf {
   id: number;
   videos: [];
}
interface Video {
   iso_639_1: string;
   iso_3166_1: string;
   name: string;
   key: string;
   site: string;
   size: number;
   type: string;
   official: boolean;
   published_at: Date;
   id: string;
}

const app: Application = express();

// =========================================================

//read movie
const Movies = {
   all: function () {
      const filePath = path.join(__dirname, '../data/movieList.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent).map((movie: Movie) => movie);
   },
};

const movieList = Movies.all();
const PAGE_SIZE = 20;

//lấy movie list trending
app.get(
   '/api/movies/trending',
   authenticateToken,
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         // Lấy thông số trang hiện tại từ query string
         const currentPage = parseInt(req.query.page as string) || 1;

         // Tính vị trí bắt đầu và kết thúc của phần tử trên trang hiện tại
         const offset = (currentPage - 1) * PAGE_SIZE;
         const limit = PAGE_SIZE;

         // Lấy danh sách các film từ cơ sở dữ liệu và sắp xếp theo trường popularity giảm dần
         const movies = [...movieList]
            .sort((a: Movie, b: Movie) => b.popularity - a.popularity)
            .slice(offset, offset + limit);

         // Tính tổng số trang dựa trên số lượng phần tử và kích thước trang
         const totalMovies = movieList.length;
         const totalPages = Math.ceil(totalMovies / PAGE_SIZE);

         // Trả về danh sách các film và thông tin phân trang
         res.json({
            results: movies,
            //trả về thông tin page
            page: currentPage,
            total_pages: totalPages,
            //   pagination: {
            //     currentPage,
            //     totalPages,
            //     hasPrevPage: currentPage > 1,
            //     hasNextPage: currentPage < totalPages,
            //   },
         });
         res.status(200);
      } catch (error) {
         next(error);
      }
   }
);

// =========================================================
// lấy movie list top rate
app.get(
   '/api/movies/top-rate',
   authenticateToken,
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         // Lấy thông số trang hiện tại từ query string
         const currentPage = parseInt(req.query.page as string) || 1;

         // Tính vị trí bắt đầu và kết thúc của phần tử trên trang hiện tại
         const offset = (currentPage - 1) * PAGE_SIZE;
         const limit = PAGE_SIZE;

         // Lấy danh sách các film từ cơ sở dữ liệu và sắp xếp theo trường popularity giảm dần
         const movies = [...movieList]
            .sort((a: Movie, b: Movie) => b.popularity - a.popularity)
            .slice(offset, offset + limit);

         // Tính tổng số trang dựa trên số lượng phần tử và kích thước trang
         const totalMovies = movieList.length;
         const totalPages = Math.ceil(totalMovies / PAGE_SIZE);

         // Trả về danh sách các film và thông tin phân trang
         res.json({
            results: movies,
            //trả về thông tin page
            page: currentPage,
            total_pages: totalPages,
         });
         res.status(200);
      } catch (error) {
         next(error);
      }
   }
);

// =========================================================
//read genreList
const Genre = {
   all: function () {
      const filePath = path.join(__dirname, '../data/genreList.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent).map((genre: Genre) => genre);
   },
};

const genreList = Genre.all();
//Lấy các phim theo thể loại
app.get(
   '/api/movies/discover',
   authenticateToken,
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         // Lấy thông số trang hiện tại từ query string
         const currentPage = parseInt(req.query.page as string) || 1;

         //Lấy Gerne ID của thể loại muốn tìm
         const currentGenre = parseInt(req.query.genre as string);
         if (!currentGenre) {
            res.status(400).json({ message: 'Not found genre param' });
            return;
         }

         // Tính vị trí bắt đầu và kết thúc của phần tử trên trang hiện tại
         const offset = (currentPage - 1) * PAGE_SIZE;
         const limit = PAGE_SIZE;

         // Lấy danh sách các film từ cơ sở dữ liệu và sắp xếp theo trường popularity giảm dần
         const movies = [...movieList]
            .filter((movie: Movie) => movie.genre_ids.includes(currentGenre))
            .slice(offset, offset + limit);

         const selectedGenre = genreList.find((gen: Genre) => gen.id === currentGenre);
         if (!selectedGenre) {
            res.status(400).json({ message: 'Not found that genre id' });
            return;
         }

         // Tính tổng số trang dựa trên số lượng phần tử và kích thước trang
         const totalMovies = movieList.length;
         const totalPages = Math.ceil(totalMovies / PAGE_SIZE);

         // Trả về danh sách các film và thông tin phân trang
         res.status(200).json({
            results: movies,
            //trả về thông tin page
            page: currentPage,
            total_pages: totalPages,
            genre_name: selectedGenre[0]?.name,
         });
      } catch (error) {
         next(error);
      }
   }
);
//get data từ video List
const Videos = {
   all: function () {
      const filePath = path.join(__dirname, '../data/videoList.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent).map((video: VideoListIf) => video);
   },
};
const videoList = Videos.all();

//accept json from body
app.use(express.json());

app.post(
   '/api/movies/video',
   authenticateToken,
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const reqId = parseInt(req.body.film_id);
         if (!reqId && typeof reqId !== 'string') {
            res.status(400).json({ message: 'Not found film_id params' });
            return;
         }
         const filterListById = videoList.find((item: VideoListIf) => item.id === reqId).videos;
         const matchingVideos = filterListById.filter(
            (v: Video) =>
               v.official && v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
         );
         if (matchingVideos.length === 0) {
            res.status(404).json({ message: 'Not found video' });
            return;
         }
         // ==========================cach 1===============================
         // const latestVideo = matchingVideos.reduce((prev: Video, current: Video) => {
         //    return prev.published_at > current.published_at ? prev : current;
         // });
         // ==========================cach 2===============================
         const latestVideo = matchingVideos.sort(
            (a: Video, b: Video) =>
               new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
         )[0];

         res.status(200).json({
            result: latestVideo,
         });
      } catch (error) {
         next(error);
      }
   }
);

//route search movies
app.post(
   '/api/movies/search',
   authenticateToken,
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const errors:string[] = [];

         const convertDataSearch = (data: string) => {
            return data.trim().toLowerCase();
         };
         //lấy currentPage từ param 
         const currentPage = parseInt(req.params.page) || 1;

         //lấy keyword từ body request
         const reqKeyWord = req.body.hasOwnProperty('keyword')
            ? convertDataSearch(req.body.keyword)
            : '';
         //check Valid request

         //lấy Genre từ body request
         const reqGenre = req.body.hasOwnProperty('genre')
            ? convertDataSearch(req.body.genre)
            : null;
         //lấy MediaType từ body request
         const reqMediaType = req.body.hasOwnProperty('mediaType')
            ? convertDataSearch(req.body.mediaType)
            : null;
         //lấy Language từ body request
         const reqLanguage = req.body.hasOwnProperty('language')
            ? convertDataSearch(req.body.language)
            : null;
         //lấy Year từ body request
         const reqYear = req.body.hasOwnProperty('year') ? parseInt(req.body.year) : null;

        //validate request
         if (isNaN(currentPage) || currentPage < 1) {
            errors.push('Invalid page parameter' );
         }

         if (!reqKeyWord || reqKeyWord === '') {
            errors.push('Missing or empty keyword parameter');
         }

         if (reqGenre && typeof reqGenre !== 'string') {
            errors.push('Invalid genre parameter');
         }

         if (reqMediaType && typeof reqMediaType !== 'string') {
            errors.push('Invalid mediaType parameter');
         }

         if (reqLanguage && typeof reqLanguage !== 'string') {
            errors.push('Invalid language parameter');
         }

         if (reqYear && (isNaN(reqYear) || reqYear > new Date().getFullYear())) {
            errors.push('Invalid year parameter');
         }

         if (errors.length > 0) {
            return res.status(400).json({ message: errors });
         }

         // paging
         const offset = (currentPage - 1) * PAGE_SIZE;
         const limit = PAGE_SIZE;

         const movieListSearch = [...movieList]
            .filter((movie: Movie) => {
               // Tìm kiếm theo từ khóa
               const isMatchKeyword =
                  convertDataSearch(movie.title || '').includes(reqKeyWord) ||
                  convertDataSearch(movie.overview || '').includes(reqKeyWord);
               // Tìm kiếm theo thể loại
               const isMatchGenre = reqGenre
                  ? movie.genre_ids.includes(
                       genreList.find((genre: Genre) => convertDataSearch(genre.name) === reqGenre)
                          ?.id || -1
                    )
                  : true;

               // Tìm kiếm theo loại phim
               const isMatchMediaType = reqMediaType
                  ? convertDataSearch(movie.media_type) === reqMediaType
                  : true;

               // Tìm kiếm theo ngôn ngữ
               const isMatchLanguage = reqLanguage
                  ? convertDataSearch(movie.original_language) === reqLanguage
                  : true;

               // Tìm kiếm theo năm phát hành
               const isMatchYear = reqYear
                  ? new Date(movie.release_date).getFullYear() === reqYear
                  : true;

               return (
                  isMatchKeyword &&
                  isMatchGenre &&
                  isMatchMediaType &&
                  isMatchLanguage &&
                  isMatchYear
               );
            })
            .slice(offset, limit + offset);
         const totalMovieSearch = movieListSearch.length;
         const totalPages = Math.ceil(totalMovieSearch / PAGE_SIZE);
         res.json({
            results: movieListSearch,
            //trả về thông tin page
            page: currentPage,
            total_pages: totalPages,
         });
      } catch (error) {
         next(error);
      }
   }
);

app.use((req, res, next) => {
   res.status(404).json({ message: 'Route not found' });
});

const movieRoute: Router = app;
export { movieRoute };
