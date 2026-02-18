// Crop advisory data for Kisii County
const cropAdvisories = {
  tea: {
    name: 'Tea',
    scientificName: 'Camellia sinensis',
    overview: 'Tea is one of the most important cash crops in Kisii County, thriving in the high-altitude areas with adequate rainfall.',
    climate: {
      temperature: '18-25°C',
      rainfall: '1200-1400mm annually',
      altitude: '1500-2100m above sea level',
      soil: 'Deep, well-drained acidic soils (pH 4.5-5.5)'
    },
    planting: {
      season: 'Plant during rainy seasons (March-May or September-November)',
      spacing: '1.2m x 0.6m for optimal yield',
      preparation: 'Clear land, mark planting holes, add manure or compost'
    },
    care: [
      'Weed regularly, especially during first 3 years',
      'Prune annually to maintain bush height at 0.6-1m',
      'Apply fertilizer (NPK 25:5:5) at 150kg per acre twice yearly',
      'Mulch around plants to retain moisture'
    ],
    pests: [
      'Tea mosquito bug - spray with approved pesticides',
      'Thrips - use neem-based solutions',
      'Root diseases - ensure good drainage'
    ],
    harvesting: {
      time: 'Begin plucking 3-4 years after planting',
      method: 'Pluck two leaves and a bud every 7-10 days',
      yield: '1500-2500 kg green leaf per acre annually'
    },
    market: 'Sell through KTDA tea factories or cooperative societies'
  },
  coffee: {
    name: 'Coffee',
    scientificName: 'Coffea arabica',
    overview: 'Coffee is a premium cash crop in Kisii County, known for producing high-quality Arabica beans with good market demand.',
    climate: {
      temperature: '15-24°C',
      rainfall: '1000-1800mm annually',
      altitude: '1400-2100m above sea level',
      soil: 'Well-drained volcanic soils, rich in organic matter (pH 5.5-6.5)'
    },
    planting: {
      season: 'Plant at onset of long rains (March-April)',
      spacing: '2.75m x 2.75m (standard) or 2m x 2m (high density)',
      preparation: 'Dig holes 60cm x 60cm x 60cm, fill with topsoil mixed with manure'
    },
    care: [
      'Mulch heavily around coffee trees',
      'Apply NPK fertilizer: 150g per tree for young plants, 300g for mature trees',
      'Prune after harvesting to maintain tree shape',
      'Control weeds through manual weeding or mulching'
    ],
    pests: [
      'Coffee Berry Disease (CBD) - spray with copper-based fungicides',
      'Coffee Leaf Rust - use systemic fungicides',
      'Antestia bugs - use approved insecticides'
    ],
    harvesting: {
      time: 'Main harvest: October-December; Fly crop: May-July',
      method: 'Handpick only ripe red cherries',
      yield: '5-15 kg of clean coffee per tree annually'
    },
    market: 'Sell through cooperative societies or directly at coffee mills'
  },
  bananas: {
    name: 'Bananas',
    scientificName: 'Musa species',
    overview: 'Bananas are a vital food and income crop in Kisii County, serving both subsistence and commercial purposes.',
    climate: {
      temperature: '20-30°C',
      rainfall: '1000-2000mm annually, evenly distributed',
      altitude: 'Up to 2000m above sea level',
      soil: 'Deep, fertile, well-drained loamy soils (pH 6-7)'
    },
    planting: {
      season: 'Plant at onset of rains',
      spacing: '3m x 3m for cooking bananas; 2m x 2m for sweet bananas',
      preparation: 'Dig holes 60cm deep, add manure and topsoil mixture'
    },
    care: [
      'Mulch heavily with banana leaves and crop residues',
      'Apply manure or compost: 10-20kg per mat every 6 months',
      'Remove dead leaves and suckers regularly',
      'Prop bunches with poles to prevent breaking'
    ],
    pests: [
      'Panama disease - use disease-free suckers, practice crop rotation',
      'Banana weevils - use clean planting material, apply wood ash',
      'Nematodes - use certified planting material'
    ],
    harvesting: {
      time: '9-12 months after planting',
      method: 'Harvest when fingers are full and rounded',
      yield: '30-50kg per bunch, multiple harvests per year'
    },
    market: 'Local markets, urban centers, or through farmer cooperatives'
  },
  avocados: {
    name: 'Avocados',
    scientificName: 'Persea americana',
    overview: 'Avocados are an increasingly important export crop in Kisii County with growing international demand.',
    climate: {
      temperature: '15-30°C',
      rainfall: '1000-1600mm annually',
      altitude: '1200-2400m above sea level',
      soil: 'Well-drained soils, rich in organic matter (pH 5.5-7)'
    },
    planting: {
      season: 'Plant during rainy seasons',
      spacing: '8m x 8m to 10m x 10m',
      preparation: 'Dig holes 60cm x 60cm x 60cm, add 2-3 debes of manure'
    },
    care: [
      'Mulch around trees to conserve moisture',
      'Apply manure: 50kg per tree annually',
      'Prune to maintain manageable height and shape',
      'Water during dry spells, especially young trees'
    ],
    pests: [
      'Anthracnose - spray with copper fungicides',
      'Avocado thrips - use neem oil or approved insecticides',
      'Root rot - ensure good drainage'
    ],
    harvesting: {
      time: 'Trees begin bearing after 3-5 years',
      method: 'Pick when fruit reaches mature size, allow to ripen off tree',
      yield: '50-200kg per tree depending on variety and age'
    },
    market: 'Export markets (Europe), local supermarkets, or cooperative societies'
  }
};

// @desc    Get all crop advisories
// @route   GET /api/advisories
// @access  Private
export const getAllAdvisories = async (req, res) => {
  try {
    const advisoriesArray = Object.keys(cropAdvisories).map(key => ({
      id: key,
      ...cropAdvisories[key]
    }));

    res.status(200).json({
      success: true,
      count: advisoriesArray.length,
      data: advisoriesArray
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single crop advisory
// @route   GET /api/advisories/:crop
// @access  Private
export const getCropAdvisory = async (req, res) => {
  try {
    const { crop } = req.params;
    const advisory = cropAdvisories[crop.toLowerCase()];
    
  if (!advisory) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found for this crop'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: crop.toLowerCase(),
        ...advisory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get advisories for user's crops
// @route   GET /api/advisories/my-crops
// @access  Private
export const getMyAdvisories = async (req, res) => {
  try {
    const userCrops = req.user.crops || [];

    if (userCrops.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No crops selected. Please update your profile.',
        data: []
      });
    }

    const userAdvisories = userCrops.map(crop => ({
      id: crop,
      ...cropAdvisories[crop]
    })).filter(advisory => advisory.name); // Filter out invalid crops

    res.status(200).json({
      success: true,
      count: userAdvisories.length,
      data: userAdvisories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};