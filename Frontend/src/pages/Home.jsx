import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addProduct } from '../utils/api';
import './Home.css';

const CATEGORIES = [
  { id: 'd5f748d1-b4a5-4a1c-b314-83a0d88015c1', label: 'Electronics & Gadgets' },
  { id: '691529e7-1861-410b-8dba-6fbaded9ba26', label: 'Fashion & Apparel' },
  { id: 'b6522a3f-20ab-428e-a764-5d47c8d45500', label: 'Home & Kitchen' },
];

const INITIAL_FORM = {
  productName: '',
  categoryId: '',
  productDescription: '',
  productPrice: '',
  productStock: '',
  imageFile: null,
};

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="center-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const isVendor = user.role === 'vendor';
  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // ── Form handlers ──────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    if (formError) setFormError('');
  };

  const handleOpenModal = () => {
    setFormData(INITIAL_FORM);
    setImagePreview(null);
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setShowModal(false);
  };

  const validateForm = () => {
    const { productName, categoryId, productDescription, productPrice, productStock, imageFile } = formData;
    if (!productName.trim()) return 'Product name is required.';
    if (!categoryId) return 'Please select a category.';
    if (!productDescription.trim()) return 'Product description is required.';
    if (!productPrice || isNaN(productPrice) || Number(productPrice) <= 0) return 'Please enter a valid price.';
    if (!productStock || isNaN(productStock) || !Number.isInteger(Number(productStock)) || Number(productStock) < 0)
      return 'Please enter a valid stock quantity (whole number).';
    if (!imageFile) return 'Please upload a product image.';
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(imageFile.type)) return 'Image must be JPEG, PNG, or WebP.';
    if (imageFile.size > 5 * 1024 * 1024) return 'Image must be smaller than 5 MB.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) { setFormError(error); return; }

    setSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      const data = new FormData();
      data.append('productName', formData.productName.trim());
      data.append('categoryId', formData.categoryId);
      data.append('productDescription', formData.productDescription.trim());
      data.append('productPrice', formData.productPrice);
      data.append('productStock', formData.productStock);
      data.append('imageFile', formData.imageFile);

      await addProduct(data);

      setFormSuccess('🎉 Product listed successfully!');
      setFormData(INITIAL_FORM);
      setImagePreview(null);
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess('');
      }, 1800);
    } catch (err) {
      setFormError(err.message || 'Failed to add product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="brand">ApexMarket</div>
        <div className="user-nav-info">
          <div className="user-tag">
            <div className="user-avatar">{userInitials}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
              <span className={`role-badge ${isVendor ? 'vendor' : 'customer'}`}>
                {user.role}
              </span>
            </div>
          </div>
          {user.roles && user.roles.length > 1 && (
            <button
              onClick={() => navigate('/role-selection')}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Switch Role
            </button>
          )}
          <button
            onClick={logout}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard Area */}
      <main className="dashboard-content">
        <div className="welcome-banner">
          <h1 className="welcome-title">Hello, {user.name}!</h1>
          <p className="welcome-subtitle">
            Welcome back to ApexMarket. Here is an overview of your activity.
          </p>
        </div>

        {isVendor ? (
          /* ── Vendor Dashboard ──────────────────────────────────────── */
          <>
            <div className="metrics-grid">
              <div className="dashboard-card glass-panel">
                <div className="card-icon">💰</div>
                <div className="card-title">Total Revenue</div>
                <div className="card-value">$12,450.00</div>
                <div className="card-trend up">▲ +12.4% vs last week</div>
              </div>
              <div className="dashboard-card glass-panel">
                <div className="card-icon">📦</div>
                <div className="card-title">Products Sold</div>
                <div className="card-value">342</div>
                <div className="card-trend up">▲ +8.2% vs last week</div>
              </div>
              <div className="dashboard-card glass-panel">
                <div className="card-icon">🏷️</div>
                <div className="card-title">Active Listings</div>
                <div className="card-value">18</div>
                <div className="card-trend neutral">● No change</div>
              </div>
            </div>

            <div className="showcase-section">
              <h3>Vendor Console</h3>
              <p className="showcase-text">
                Your store is live. Start listing new products, managing inventory, or responding to customer queries.
              </p>
              <div className="action-bar">
                <button className="btn btn-primary" onClick={handleOpenModal} id="add-product-btn">
                  + Add New Product
                </button>
                <button className="btn btn-secondary">View Inventory</button>
              </div>
            </div>
          </>
        ) : (
          /* ── Customer Dashboard ─────────────────────────────────────── */
          <>
            <div className="metrics-grid">
              <div className="dashboard-card glass-panel">
                <div className="card-icon">🛍️</div>
                <div className="card-title">Active Orders</div>
                <div className="card-value">2</div>
                <div className="card-trend up">In transit</div>
              </div>
              <div className="dashboard-card glass-panel">
                <div className="card-icon">💳</div>
                <div className="card-title">Wallet Balance</div>
                <div className="card-value">$150.00</div>
                <div className="card-trend neutral">● Available funds</div>
              </div>
              <div className="dashboard-card glass-panel">
                <div className="card-icon">❤️</div>
                <div className="card-title">Wishlist Items</div>
                <div className="card-value">12</div>
                <div className="card-trend neutral">Ready to checkout</div>
              </div>
            </div>

            <div className="showcase-section">
              <h3>Discover Products</h3>
              <p className="showcase-text">
                Explore thousands of products listed by verified vendors. From electronics to fashion, find everything you need.
              </p>
              <div className="action-bar">
                <button className="btn btn-primary">Browse Marketplace</button>
                <button className="btn btn-secondary">Track Orders</button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── Add Product Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-panel glass-panel" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h2 className="modal-title" id="modal-title">List a New Product</h2>
                <p className="modal-subtitle">Fill in the details to add your product to the marketplace.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Close modal" disabled={submitting}>
                ✕
              </button>
            </div>

            {/* Alerts */}
            {formError && <div className="alert alert-error" role="alert">{formError}</div>}
            {formSuccess && <div className="alert alert-success" role="status">{formSuccess}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="product-form">
              {/* Row 1: Name + Category */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="productName">Product Name</label>
                  <input
                    id="productName"
                    name="productName"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    value={formData.productName}
                    onChange={handleInputChange}
                    disabled={submitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="categoryId">Category</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="form-input form-select"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    disabled={submitting}
                    required
                  >
                    <option value="">— Select a category —</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="productDescription">Description</label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  className="form-input form-textarea"
                  placeholder="Describe your product: key features, materials, dimensions…"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  disabled={submitting}
                  rows={4}
                  required
                />
              </div>

              {/* Row 2: Price + Stock */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="productPrice">Price (USD $)</label>
                  <input
                    id="productPrice"
                    name="productPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={formData.productPrice}
                    onChange={handleInputChange}
                    disabled={submitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="productStock">Stock Quantity</label>
                  <input
                    id="productStock"
                    name="productStock"
                    type="number"
                    min="0"
                    step="1"
                    className="form-input"
                    placeholder="0"
                    value={formData.productStock}
                    onChange={handleInputChange}
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label" htmlFor="imageFile">Product Image</label>
                <label htmlFor="imageFile" className={`image-upload-zone ${imagePreview ? 'has-image' : ''} ${submitting ? 'disabled' : ''}`}>
                  {imagePreview ? (
                    <div className="image-preview-wrapper">
                      <img src={imagePreview} alt="Product preview" className="image-preview" />
                      <span className="image-change-hint">Click to change</span>
                    </div>
                  ) : (
                    <div className="image-upload-placeholder">
                      <span className="upload-icon">📸</span>
                      <span className="upload-label">Click to upload image</span>
                      <span className="upload-hint">JPEG, PNG, WebP — max 5 MB</span>
                    </div>
                  )}
                  <input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    disabled={submitting}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting} id="submit-product-btn">
                  {submitting ? <span className="spinner" /> : 'List Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
