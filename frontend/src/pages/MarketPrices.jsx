import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { marketAPI } from '../services/api';
import { FaMoneyBillWave, FaPlus, FaLeaf } from 'react-icons/fa';

const MarketPrices = () => {
  const { user } = useAuth();
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ crop: 'tea', pricePerKg: '', quality: 'standard' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const canAddPrice = user?.role === 'extension_officer' || user?.role === 'buyer';

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await marketAPI.getAll();
      setPrices(response.data.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      await marketAPI.addPrice({ crop: formData.crop, pricePerKg: parseFloat(formData.pricePerKg), quality: formData.quality });
      setMessage({ type: 'success', text: 'Price updated successfully!' });
      setFormData({ crop: 'tea', pricePerKg: '', quality: 'standard' });
      setShowAddForm(false);
      fetchPrices();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update price' });
    } finally {
      setSubmitting(false);
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
          <p className="mt-4 text-gray-600">Loading market prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaMoneyBillWave className="text-yellow-500" />
              Market Prices
            </h1>
            <p className="text-gray-600">Current market prices for crops in Kisii County</p>
          </div>
          {canAddPrice && (
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
              <FaPlus /> Update Price
            </button>
          )}
        </div>

        {message.text && <div className={`alert alert-${message.type} mb-6`}>{message.text}</div>}

        {showAddForm && canAddPrice && (
          <div className="card mb-8 bg-linear-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Market Price</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Crop</label>
                  <select name="crop" className="input" value={formData.crop} onChange={(e) => setFormData({...formData, crop: e.target.value})} required>
                    <option value="tea">Tea</option>
                    <option value="coffee">Coffee</option>
                    <option value="bananas">Bananas</option>
                    <option value="avocados">Avocados</option>
                  </select>
                </div>
                <div>
                  <label className="label">Price per Kg (KES)</label>
                  <input type="number" className="input" placeholder="Enter price" value={formData.pricePerKg} onChange={(e) => setFormData({...formData, pricePerKg: e.target.value})} min="0" step="0.01" required />
                </div>
                <div>
                  <label className="label">Quality</label>
                  <select name="quality" className="input" value={formData.quality} onChange={(e) => setFormData({...formData, quality: e.target.value})} required>
                    <option value="premium">Premium</option>
                    <option value="standard">Standard</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Price'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(prices).length > 0 ? (
            Object.entries(prices).map(([crop, cropPrices]) => (
              <div key={crop} className="card p-0 overflow-hidden">
                <div className={`p-4 bg-linear-to-br ${cropColors[crop]} text-white flex items-center gap-3`}>
                  <FaLeaf className="text-3xl" />
                  <h3 className="text-2xl font-bold capitalize">{crop}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {cropPrices.map((price, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border-l-4 border-primary-500">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`badge badge-${price.quality === 'premium' ? 'success' : price.quality === 'standard' ? 'warning' : 'danger'}`}>
                          {price.quality.charAt(0).toUpperCase() + price.quality.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(price.date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-2xl font-bold text-primary-500">KES {price.pricePerKg}/kg</div>
                      {price.updatedBy && <p className="text-xs text-gray-500 mt-1">by {price.updatedBy.name}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full card text-center py-12">
              <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Market Prices Available</h3>
              <p className="text-gray-500">
                {canAddPrice ? 'Be the first to update market prices!' : 'Market prices will appear here once updated by extension officers or buyers.'}
              </p>
            </div>
          )}
        </div>

        <div className="card bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Market Prices</h2>
          <p className="text-gray-700 mb-4">
            Market prices are updated regularly by extension officers and registered buyers to provide farmers with accurate pricing information. 
            Prices may vary based on:
          </p>
          <ul className="space-y-2 text-gray-700 mb-4">
            {['Quality grade (Premium, Standard, Low)', 'Market location within Kisii County', 'Season and supply-demand dynamics', 'Processing and packaging requirements'].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> These prices are indicative and may vary. Always verify prices with your buyer before making a sale.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;