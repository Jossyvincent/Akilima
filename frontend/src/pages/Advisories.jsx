import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { advisoryAPI } from '../services/api';
import { FaLeaf } from 'react-icons/fa';

const Advisories = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const fetchAdvisories = async () => {
    try {
      const response = await advisoryAPI.getAll();
      setAdvisories(response.data.data);
    } catch (error) {
      console.error('Error fetching advisories:', error);
    } finally {
      setLoading(false);
    }
  };

  const cropColors = {
    tea: 'from-green-500 to-green-600',
    coffee: 'from-amber-700 to-amber-800',
    bananas: 'from-yellow-500 to-yellow-600',
    avocados: 'from-green-600 to-green-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="loader mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading crop advisories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaLeaf className="text-primary-500" />
            Crop Advisories
          </h1>
          <p className="text-gray-600">Comprehensive farming guidance for Kisii County's major crops</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {advisories.map((advisory) => (
            <Link
              key={advisory.id}
              to={`/advisories/${advisory.id}`}
              className="card hover:shadow-xl transition-all duration-300 group border-t-4 border-primary-500"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 bg-linear-to-br ${cropColors[advisory.id]} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <FaLeaf className="text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary-500 transition-colors">
                    {advisory.name}
                  </h3>
                  <p className="text-sm italic text-gray-500">{advisory.scientificName}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{advisory.overview}</p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-success">Climate: {advisory.climate.temperature}</span>
                <span className="badge badge-info">Altitude: {advisory.climate.altitude}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="card bg-linear-to-br from-green-50 to-green-100 border border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Crop Advisories</h2>
          <p className="text-gray-700 mb-4">
            These advisories are specifically tailored for Kisii County's agro-ecological conditions. 
            Each advisory contains detailed information on:
          </p>
          <ul className="space-y-2 text-gray-700">
            {[
              'Optimal climate and soil conditions',
              'Planting seasons and spacing guidelines',
              'Care and maintenance practices',
              'Common pests and disease management',
              'Harvesting techniques and expected yields',
              'Market information and best practices'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-600 mt-4">Click on any crop card above to view detailed advisory information.</p>
        </div>
      </div>
    </div>
  );
};

export default Advisories;