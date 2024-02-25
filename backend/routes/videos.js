import express from "express";
import {addVideo, getVideo,search, getByTag, random, sub, trend} from "../controllers/video.js";
import {verifyToken} from "../verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, addVideo);
router.delete("/:id", verifyToken, addVideo);
router.get("/find/:id", addVideo);
router.put("/view/:id", addVideo);
router.get("/trend", trend);
router.get("/random", random);
router.get("/sub", verifyToken, sub);
router.get("/tags", getByTag);
router.get("/search", search)

export default router;
