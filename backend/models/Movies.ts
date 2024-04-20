
import express, { Application, Request, Response, NextFunction, Router } from 'express';
import path from 'path';
import fs from 'fs';
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
 
 interface GenreInterface {
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
 
 const Movies = {
    all: function () {
       const filePath = path.join(__dirname, '../data/movieList.json');
       const fileContent = fs.readFileSync(filePath, 'utf-8');
       return JSON.parse(fileContent).map((movie: Movie) => movie);
    },
 };
 
 const Genre = {
    all: function () {
       const filePath = path.join(__dirname, '../data/genreList.json');
       const fileContent = fs.readFileSync(filePath, 'utf-8');
       return JSON.parse(fileContent).map((genre: GenreInterface) => genre);
    },
 };
 
 const Videos = {
    all: function () {
       const filePath = path.join(__dirname, '../data/videoList.json');
       const fileContent = fs.readFileSync(filePath, 'utf-8');
       return JSON.parse(fileContent).map((video: VideoListIf) => video);
    },
 };
 
 export { Movie, Genre, VideoListIf, Video, Movies, GenreInterface, Videos };
 