import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

interface User {
  userId: string;
  token: string;
}

//read userToken.json
const Users = {
  all: function () {
    const filePath = path.join(__dirname, "./data/userToken.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent).map((user: User) => user);
  },
};
const userToken = Users.all();

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || null;

  //nếu có token thì cắt chuỗi từ ' ' và lấy phần tử phía sau, bỏ bearer.
  const token = authHeader ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //check token có giống token trong list đã có không
  const user = userToken.find((user: User) => user.token === token);
  if (!user) {
    return res.status(401).json({ message: "Wrong token!" });
  }
  next();
}

export default authenticateToken;
