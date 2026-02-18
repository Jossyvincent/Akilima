import express from "express";
import { getMarketPrices, getCropPrice, addMarketPrice, getPriceHistory, deleteMarketPrice } from '../controllers/marketController.js';
import{ protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// tested
router.get('/', protect, getMarketPrices);
// tested
router.get('/:crop', protect, getCropPrice);
//tested
router.get('/:crop/history', protect, getPriceHistory);
//tested
router.post('/', protect, authorize('extension_officer', 'buyer'), addMarketPrice);
// tested
router.delete('/:id', protect, authorize('extension_officer'), deleteMarketPrice);

export default router