import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: "토큰 없음" });

  const token = h.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = decoded; // { uid: ... }
    next();
  } catch {
    return res.status(401).json({ error: "토큰이 유효하지 않음" });
  }
};

export default auth;