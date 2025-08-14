
import { Router } from "express";
import prisma from "../lib/prisma.js";
import auth from "../middleware/auth.js";

const router = Router();

// 이 라우터에 들어오는 모든 요청은 토큰 검증
router.use(auth);

// 예시: 내 프로필 조회
router.get("/me", async (req, res) => {
  const me = await prisma.user.findUnique({
    where: { id: req.user.uid },
    select: { id: true, email: true, nickname: true },
  });
  res.json(me);
});

router.get("/bookmarks", async(req, res)=>{
    const{mediaType}= req.query;
    const list = await prisma.bookmark.findMany({
        where:{userId:req.user.uid,...(mediaType ? {mediaType}:{})},
        orderBy:{createdAt:"desc"},

    })
    res.json(list)
})
/** 북마크 존재 여부 체크 (상세 페이지 초기 상태) */
router.get("/bookmarks/exists", async (req, res) => {
  const { provider = "tmdb", mediaType = "movie", externalId } = req.query;
  if (!externalId) return res.status(400).json({ error: "externalId 필요" });
  const it = await prisma.bookmark.findUnique({
    where: {
      userId_provider_mediaType_externalId: {
        userId: req.user.uid,
        provider,
        mediaType,
        externalId: String(externalId),
      },
    },
  });
  res.json({ saved: !!it, id: it?.id });
});

/** 북마크 토글 (없으면 생성, 있으면 삭제) */
router.post("/bookmarks/toggle", async (req, res) => {
  const {
    provider = "tmdb",
    mediaType = "movie",
    externalId,
    title,
    posterUrl,
  } = req.body || {};
  if (!externalId) return res.status(400).json({ error: "externalId 필요" });

  const where = {
    userId_provider_mediaType_externalId: {
      userId: req.user.uid,
      provider,
      mediaType,
      externalId: String(externalId),
    },
  };

  const existing = await prisma.bookmark.findUnique({ where });
  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return res.json({ saved: false });
  }
  await prisma.bookmark.create({
    data: {
      userId: req.user.uid,
      provider,
      mediaType,
      externalId: String(externalId),
      title: title ?? null,
      posterUrl: posterUrl ?? null,
    },
  });
  return res.json({ saved: true });
});
export const protectedRouter = router;