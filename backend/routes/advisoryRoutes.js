import express from "express";
import { getAllAdvisories, getCropAdvisory, getMyAdvisories,} from "../controllers/advisoryController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All API endpoints tested and working as expected
router.get("/", protect, getAllAdvisories);
router.get("/my-crops", protect, getMyAdvisories);
router.get("/:crop", protect, getCropAdvisory);

export default router;
