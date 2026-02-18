import axios from 'axios';

// @desc    Get weather data for Kisii County
// @route   GET /api/weather
// @access  Private
export const getWeather = async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Weather API key not configured'
      });
    }

    // Kisii County coordinates
    const lat = -0.6817;
    const lon = 34.7680;

    // Fetch current weather and forecast
    const [currentWeather, forecast] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    ]);

    // Process forecast data (get daily forecast for next 5 days)
    const dailyForecast = [];
    const forecastData = forecast.data.list;
    
    for (let i = 0; i < forecastData.length; i += 8) {
      if (dailyForecast.length < 5) {
        const day = forecastData[i];
        dailyForecast.push({
          date: day.dt_txt.split(' ')[0],
          temp: {
            min: Math.round(day.main.temp_min),
            max: Math.round(day.main.temp_max)
          },
          weather: day.weather[0].main,
          description: day.weather[0].description,
          icon: day.weather[0].icon,
          humidity: day.main.humidity,
          windSpeed: day.wind.speed,
          rainfall: day.rain ? day.rain['3h'] : 0
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        current: {
          temp: Math.round(currentWeather.data.main.temp),
          feelsLike: Math.round(currentWeather.data.main.feels_like),
          humidity: currentWeather.data.main.humidity,
          pressure: currentWeather.data.main.pressure,
          windSpeed: currentWeather.data.wind.speed,
          weather: currentWeather.data.weather[0].main,
          description: currentWeather.data.weather[0].description,
          icon: currentWeather.data.weather[0].icon,
          sunrise: currentWeather.data.sys.sunrise,
          sunset: currentWeather.data.sys.sunset
        },
        forecast: dailyForecast,
        location: {
          name: 'Kisii County',
          country: 'Kenya',
          coordinates: { lat, lon }
        }
      }
    });
  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
};

// @desc    Get agricultural weather advisory
// @route   GET /api/weather/advisory
// @access  Private
export const getWeatherAdvisory = async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const lat = -0.6817;
    const lon = 34.7680;

    const currentWeather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const temp = currentWeather.data.main.temp;
    const humidity = currentWeather.data.main.humidity;
    const rainfall = currentWeather.data.rain ? currentWeather.data.rain['1h'] : 0;

    // Generate farming advisories based on weather
    const advisories = [];

    if (temp > 28) {
      advisories.push({
        type: 'warning',
        message: 'High temperature detected. Ensure adequate irrigation for crops.'
      });
    }

    if (humidity > 80) {
      advisories.push({
        type: 'caution',
        message: 'High humidity levels. Monitor crops for fungal diseases.'
      });
    }

    if (rainfall > 0) {
      advisories.push({
        type: 'info',
        message: 'Rainfall detected. Good conditions for planting and growth.'
      });
    }

    if (temp >= 18 && temp <= 25 && humidity >= 60 && humidity <= 80) {
      advisories.push({
        type: 'success',
        message: 'Optimal conditions for tea and coffee cultivation.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        temperature: Math.round(temp),
        humidity,
        rainfall,
        advisories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate weather advisory'
    });
  }
};