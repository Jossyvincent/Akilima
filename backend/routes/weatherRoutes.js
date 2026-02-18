import express from "express";
import { getWeather, getWeatherAdvisory } from '../controllers/weatherController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// all the api endpionts tested
router.get('/', protect, getWeather);
router.get('/advisory', protect, getWeatherAdvisory);

export default router;