import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaLeaf } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    phone: '',
    crops: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const cropOptions = ['tea', 'coffee', 'bananas', 'avocados'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCropChange = (e) => {
    const crop = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setFormData({
        ...formData,
        crops: [...formData.crops, crop]
      });
    } else {
      setFormData({
        ...formData,
        crops: formData.crops.filter((c) => c !== crop)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      crops: formData.crops
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-primary-500 to-primary-700">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <FaLeaf className="text-6xl text-primary-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Akilima</h1>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-6">
              {error}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <FaUser className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="input mx-2"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                className="input mx-2"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label">
                <FaPhone className="inline mr-2" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                className="input"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Role</label>
              <select
                name="role"
                className="input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="farmer">Farmer</option>
                <option value="extension_officer">Extension Officer</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>

            {formData.role === 'farmer' && (
              <div>
                <label className="label">Select Your Crops</label>
                <div className="space-y-2">
                  {cropOptions.map((crop) => (
                    <label key={crop} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={crop}
                        onChange={handleCropChange}
                        className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-gray-700 capitalize">{crop}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="label">
                <FaLock className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                className="input mx-2"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label">
                <FaLock className="inline mr-2" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="input mx-1"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;