import mongoose from "mongoose";

const marketPriceSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    enum: ['tea', 'coffee', 'bananas', 'avocados']
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'KES/kg'
  },
  market: {
    type: String,
    default: 'Kisii County'
  },
  quality: {
    type: String,
    enum: ['premium', 'standard', 'low'],
    default: 'standard'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("MarketPrice", marketPriceSchema);