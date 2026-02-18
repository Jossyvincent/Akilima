import React, { useState, useEffect } from 'react';
import { weatherAPI } from '../services/api';
import { FaCloudSun, FaThermometerHalf, FaTint, FaWind, FaSun, FaMoon } from 'react-icons/fa';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const [weatherRes, advisoryRes] = await Promise.all([
        weatherAPI.getWeather(),
        weatherAPI.getAdvisory()
      ]);
      setWeatherData(weatherRes.data.data);
      setAdvisory(advisoryRes.data.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="loader mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaCloudSun className="text-blue-500" />
            Weather Dashboard
          </h1>
          <p className="text-gray-600">Real-time weather information for Kisii County</p>
        </div>

        {weatherData && (
          <>
            {/* Current Weather */}
            <div className="card mb-8 bg-linear-to-br from-blue-500 to-blue-600 text-white">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{weatherData.location.name}</h2>
                <p className="opacity-90">{weatherData.location.country}</p>
              </div>
              <div className="text-center mb-8">
                <div className="text-7xl font-bold mb-2">{weatherData.current.temp}°C</div>
                <p className="text-2xl capitalize opacity-90 mb-1">{weatherData.current.description}</p>
                <p className="opacity-80">Feels like {weatherData.current.feelsLike}°C</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: FaTint, label: 'Humidity', value: `${weatherData.current.humidity}%` },
                  { icon: FaWind, label: 'Wind Speed', value: `${weatherData.current.windSpeed} m/s` },
                  { icon: FaThermometerHalf, label: 'Pressure', value: `${weatherData.current.pressure} hPa` },
                  { icon: FaSun, label: 'Sunrise', value: new Date(weatherData.current.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
                  { icon: FaMoon, label: 'Sunset', value: new Date(weatherData.current.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                    <item.icon className="text-3xl mx-auto mb-2 opacity-80" />
                    <p className="text-sm opacity-80 mb-1">{item.label}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agricultural Advisory */}
            {advisory?.advisories?.length > 0 && (
              <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Agricultural Advisory</h2>
                <div className="space-y-3">
                  {advisory.advisories.map((item, index) => (
                    <div key={index} className={`alert alert-${item.type}`}>
                      {item.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5-Day Forecast */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5-Day Forecast</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                    <p className="font-semibold text-gray-900 mb-3">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <FaCloudSun className="text-5xl text-blue-500 mx-auto mb-3" />
                    <div className="flex justify-center gap-3 text-lg font-semibold mb-2">
                      <span className="text-gray-900">{day.temp.max}°</span>
                      <span className="text-gray-400">{day.temp.min}°</span>
                    </div>
                    <p className="text-sm text-gray-600 capitalize mb-3">{day.description}</p>
                    <div className="flex justify-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaTint /> {day.humidity}%
                      </span>
                      <span className="flex items-center gap-1">
                        <FaWind /> {day.windSpeed}m/s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;