import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import route from "./routes/movie";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }) as express.RequestHandler);
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json() as express.RequestHandler);

// Routes
app.use("/api/movies", route);

// 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("<h1>Page not found on the server</h1>");
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log("====================================");
  console.log("App running on port " + PORT);
  console.log("====================================");
});
