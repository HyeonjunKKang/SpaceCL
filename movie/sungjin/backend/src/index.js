import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./lib/prisma.js"
import {protectedRouter} from"./routes/protected.js"


const app = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
const PORT = process.env.PORT || 4000;  



const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// 헬스체크
app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// 회원가입
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email/password 필요" });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "이미 가입된 이메일" });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, nickname: nickname ?? null },
      select: { id: true, email: true, nickname: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch {
    res.status(500).json({ error: "server error" });
  }
});

// 로그인
app.post("/api/auth/login", async (req, res) => {
    try{
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "이메일 또는 비밀번호 오류" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "이메일 또는 비밀번호 오류" });
 

  const token =jwt.sign(
    {uid: user.id},
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d"}
)
   return res.json({
      token,
      user: { id: user.id, email: user.email, nickname: user.nickname }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "서버 오류가 발생했습니다" });
  }
});
 app.use("/api", protectedRouter);
  

app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));