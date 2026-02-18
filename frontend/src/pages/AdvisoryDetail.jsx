import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { advisoryAPI } from '../services/api';
import { FaArrowLeft, FaLeaf, FaCloudSun, FaSeedling, FaTools, FaBug, FaTractor, FaStore } from 'react-icons/fa';

const AdvisoryDetail = () => {
  const { crop } = useParams();
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvisory();
  }, [crop]);

  const fetchAdvisory = async () => {
    try {
      const response = await advisoryAPI.getCrop(crop);
      setAdvisory(response.data.data);
    } catch (error) {
      console.error('Error fetching advisory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="loader mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading advisory...</p>
        </div>
      </div>
    );
  }

  if (!advisory) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error mb-4">Advisory not found</div>
          <Link to="/advisories" className="btn btn-primary">
            <FaArrowLeft /> Back to Advisories
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { icon: FaCloudSun, title: 'Climate Requirements', color: 'blue', data: advisory.climate, type: 'object' },
    { icon: FaSeedling, title: 'Planting Guidelines', color: 'green', data: advisory.planting, type: 'object' },
    { icon: FaTools, title: 'Care & Maintenance', color: 'yellow', data: advisory.care, type: 'list' },
    { icon: FaBug, title: 'Pest & Disease Management', color: 'red', data: advisory.pests, type: 'list' },
    { icon: FaTractor, title: 'Harvesting', color: 'purple', data: advisory.harvesting, type: 'object' },
    { icon: FaStore, title: 'Market Information', color: 'cyan', data: advisory.market, type: 'text' }
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <Link to="/advisories" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-6 font-medium">
          <FaArrowLeft /> Back to all advisories
        </Link>

        <div className="card mb-8 bg-linear-to-br from-primary-500 to-primary-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{advisory.name}</h1>
              <p className="text-xl italic opacity-90">{advisory.scientificName}</p>
            </div>
            <FaLeaf className="text-8xl opacity-20" />
          </div>
        </div>

        <div className="card mb-8 bg-linear-to-br from-green-50 to-green-100 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Overview</h3>
          <p className="text-gray-700 leading-relaxed">{advisory.overview}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <div key={idx} className="card relative">
              <div className={`absolute top-6 right-6 w-14 h-14 bg-${section.color}-500 bg-opacity-10 rounded-xl flex items-center justify-center`}>
                <section.icon className={`text-2xl text-${section.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
              {section.type === 'object' && (
                <div className="space-y-3">
                  {Object.entries(section.data).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm font-semibold text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  ))}
                </div>
              )}
              {section.type === 'list' && (
                <ul className="space-y-2">
                  {section.data.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 font-bold mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.type === 'text' && (
                <p className="text-gray-700">{section.data}</p>
              )}
              {section.title === 'Market Information' && (
                <Link to="/market-prices" className="btn btn-primary w-full mt-4">
                  View Current Market Prices
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvisoryDetail;