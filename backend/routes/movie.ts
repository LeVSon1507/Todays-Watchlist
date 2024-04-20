import express, { Router } from 'express';
import { getTrendingMovies, getTopRateMovies, getGenreMovies, searchMovies, getMovieTrailer } from '../controllers/movie';
import authenticateToken from '../userAuthorized';

const router: Router = express.Router();

router.get('/trending',authenticateToken, getTrendingMovies);
router.get('/top-rate',authenticateToken, getTopRateMovies);
router.get('/discover',authenticateToken, getGenreMovies);
router.post('/video',authenticateToken, getMovieTrailer);
router.post('/search',authenticateToken, searchMovies);

export default router;
