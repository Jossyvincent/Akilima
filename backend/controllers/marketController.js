import MarketPrice from '../models/MarketPrice.js';

// @desc    Get all market prices
// @route   GET /api/market-prices
// @access  Private
export const getMarketPrices = async (req, res) => {
  try {
    const prices = await MarketPrice.find().sort('-date').populate('updatedBy', 'name role');

    // Group by crop and get latest price for each quality
    const groupedPrices = {};

    prices.forEach(price => {
      if (!groupedPrices[price.crop]) {
        groupedPrices[price.crop] = [];
      }
      
      // Only add if this quality hasn't been added yet
      const existingQuality = groupedPrices[price.crop].find(p => p.quality === price.quality);
      if (!existingQuality) {
        groupedPrices[price.crop].push(price);
      }
    });

    res.status(200).json({
      success: true,
      data: groupedPrices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get market prices for specific crop
// @route   GET /api/market-prices/:crop
// @access  Private
export const getCropPrice = async (req, res) => {
  try {
    const { crop } = req.params;

    const prices = await MarketPrice.find({ crop: crop.toLowerCase() })
      .sort('-date')
      .limit(10)
      .populate('updatedBy', 'name role');

    if (prices.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No prices found for ${crop}`
      });
    }

    res.status(200).json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add/Update market price
// @route   POST /api/market-prices
// @access  Private (Extension Officers and Buyers)
export const addMarketPrice = async (req, res) => {
  try {
    const { crop, pricePerKg, quality, market } = req.body;

    // Validate required fields
    if (!crop || !pricePerKg) {
      return res.status(400).json({
        success: false,
        message: 'Please provide crop and price'
      });
    }

    const newPrice = await MarketPrice.create({
      crop: crop.toLowerCase(),
      pricePerKg,
      quality: quality || 'standard',
      market: market || 'Kisii County',
      updatedBy: req.user._id
    });

    const populatedPrice = await MarketPrice.findById(newPrice._id).populate('updatedBy', 'name role');

    res.status(201).json({
      success: true,
      data: populatedPrice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get price history for a crop
// @route   GET /api/market-prices/:crop/history
// @access  Private
export const getPriceHistory = async (req, res) => {
  try {
    const { crop } = req.params;
    const limit = parseInt(req.query.limit) || 30;

    const history = await MarketPrice.find({ crop: crop.toLowerCase() })
      .sort('-date')
      .limit(limit)
      .populate('updatedBy', 'name role');

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete market price (admin only)
// @route   DELETE /api/market-prices/:id
// @access  Private
export const deleteMarketPrice = async (req, res) => {
  try {
    const price = await MarketPrice.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }

    await price.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Price deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};