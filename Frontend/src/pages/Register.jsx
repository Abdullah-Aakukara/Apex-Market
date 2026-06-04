import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // default role
    storeName: '',
    businessAddress: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleRoleSelect = (roleValue) => {
    if (loading) return;
    setFormData((prev) => ({ ...prev, role: roleValue }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, role, storeName, businessAddress, phoneNumber } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return false;
    }
    
    if (name.length < 2) {
      setError('Name must be at least 2 characters long.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    // Conditional Validation for Vendors
    if (role === 'vendor') {
      if (!storeName || !businessAddress || !phoneNumber) {
        setError('Please fill in all vendor business details.');
        return false;
      }
      if (storeName.trim().length < 2) {
        setError('Store Name must be at least 2 characters long.');
        return false;
      }
      const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError('Please enter a valid phone number.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    // Prepare payload dynamically
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === 'vendor') {
      payload.storeName = formData.storeName;
      payload.businessAddress = formData.businessAddress;
      payload.phoneNumber = formData.phoneNumber;
    }

    try {
      const result = await registerUser(payload);
      console.log(result)
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please check your inputs or try another email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-container">
      <div className="register-card glass-panel">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Sign up to buy or sell products</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">I want to register as a:</label>
            <div className="role-cards">
              <div
                className={`role-card ${formData.role === 'customer' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('customer')}
              >
                <div className="role-title">Customer</div>
                <div className="role-desc">Browse and buy items</div>
              </div>
              <div
                className={`role-card ${formData.role === 'vendor' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('vendor')}
              >
                <div className="role-title">Vendor</div>
                <div className="role-desc">List and sell products</div>
              </div>
            </div>
          </div>

          {/* Conditional Vendor Registration Fields */}
          {formData.role === 'vendor' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="storeName">
                  Store Name
                </label>
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  placeholder="Apex Superstore"
                  value={formData.storeName}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="businessAddress">
                  Business Address
                </label>
                <input
                  id="businessAddress"
                  name="businessAddress"
                  type="text"
                  placeholder="123 Commerce St, New York, NY"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="form-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? <span className="spinner"></span> : 'Register'}
          </button>
        </form>

        <div className="register-footer">
          Already have an account?
          <Link to="/login" className="register-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
