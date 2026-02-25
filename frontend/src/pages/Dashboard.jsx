import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { weatherAPI, marketAPI, advisoryAPI } from '../services/api';
import { 
  FaCloudSun, FaLeaf, FaMoneyBillWave, FaUser, 
  FaThermometerHalf, FaTint, FaWind 
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [marketPrices, setMarketPrices] = useState({});
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [weatherRes, marketRes, advisoryRes] = await Promise.all([
        weatherAPI.getWeather(),
        marketAPI.getAll(),
        advisoryAPI.getMyCrops()
      ]);

      setWeather(weatherRes.data.data);
      setMarketPrices(marketRes.data.data);
      setAdvisories(advisoryRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="loader mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: FaCloudSun,
      title: 'Weather',
      value: `${weather?.current?.temp}°C`,
      label: weather?.current?.description,
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: FaLeaf,
      title: 'My Crops',
      value: user?.crops?.length || 0,
      label: 'Crops tracked',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: FaMoneyBillWave,
      title: 'Market Data',
      value: Object.keys(marketPrices).length,
      label: 'Crops with prices',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: FaUser,
      title: 'Role',
      value: user?.role?.replace('_', ' '),
      label: 'Account',
      gradient: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-600">
            Here's your agricultural dashboard for Kisii region
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-linear-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <stat.icon className="text-2xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 capitalize">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Weather */}
        {weather && (
          <div className="card mb-8 bg-linear-to-br from-green-500 to-green-600 text-white rounded-2xl p-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <FaCloudSun />
                  Current Weather in Kisii
                </h2>
                <div className="text-5xl font-bold mb-2">{weather.current.temp}°C</div>
                <p className="text-xl capitalize opacity-90">{weather.current.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <FaThermometerHalf className="text-3xl mx-auto mb-2 opacity-80" />
                  <p className="text-sm opacity-80">Feels like</p>
                  <p className="text-xl font-semibold">{weather.current.feelsLike}°C</p>
                </div>
                <div className="text-center">
                  <FaTint className="text-3xl mx-auto mb-2 opacity-80" />
                  <p className="text-sm opacity-80">Humidity</p>
                  <p className="text-xl font-semibold">{weather.current.humidity}%</p>
                </div>
                <div className="text-center">
                  <FaWind className="text-3xl mx-auto mb-2 opacity-80" />
                  <p className="text-sm opacity-80">Wind</p>
                  <p className="text-xl font-semibold">{weather.current.windSpeed} m/s</p>
                </div>
              </div>
            </div>
            <Link to="/weather" className="btn bg-white text-black hover:bg-gray-100 mt-6 border rounded p-0.5">
              View Detailed Forecast
            </Link>
          </div>
        )}

        {/* Grid for Advisories and Market Prices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Crop Advisories */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaLeaf className="text-primary-500" />
              My Crop Advisories
            </h2>
            {advisories.length > 0 ? (
              <div className="space-y-3">
                {advisories.map((advisory) => (
                  <Link
                    key={advisory.id}
                    to={`/advisories/${advisory.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{advisory.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{advisory.overview}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No crops selected. Update your profile to see personalized advisories.
              </p>
            )}
            <Link to="/advisories" className="btn btn-outline w-full mt-4">
              View All Advisories
            </Link>
          </div>

          {/* Market Prices */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-yellow-500" />
              Latest Market Prices
            </h2>
            {Object.keys(marketPrices).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(marketPrices).map(([crop, prices]) => (
                  <div key={crop} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-900 capitalize">{crop}</span>
                    <span className="text-xl font-bold text-primary-500">
                      KES {prices[0]?.pricePerKg}/kg
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No market prices available</p>
            )}
            <Link to="/market-prices" className="btn btn-outline w-full mt-4">
              View All Prices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;