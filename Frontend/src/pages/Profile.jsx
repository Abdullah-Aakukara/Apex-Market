import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, changeUserPassword } from '../utils/api';
import './Profile.css';

export default function Profile() {
  const { user, updateUserFields } = useAuth();
  const navigate = useNavigate();

  // Profile data state loaded from API
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Profile info form state
  const [infoForm, setInfoForm] = useState({
    name: '',
    phone: '',
    avatarFile: null,
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [infoSubmitting, setInfoSubmitting] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState('');
  const [infoError, setInfoError] = useState('');

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getUserProfile();
        if (res && res.success) {
          const profile = res.userProfile || {};
          setProfileData(profile);
          setInfoForm({
            name: profile.name || '',
            phone: profile.phone || '',
            avatarFile: null,
          });
          if (profile.avatarUrl) {
            setAvatarPreview(profile.avatarUrl);
          }
        } else {
          setError('Failed to fetch profile details.');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle avatar image change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setInfoError('Image file must be JPEG, PNG, or WebP.');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setInfoError('Image file must be smaller than 5 MB.');
        return;
      }

      setInfoForm((prev) => ({ ...prev, avatarFile: file }));
      setInfoError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile info submission
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (!infoForm.name.trim()) {
      setInfoError('Name cannot be empty.');
      return;
    }

    setInfoSubmitting(true);
    setInfoSuccess('');
    setInfoError('');

    try {
      const formData = new FormData();
      formData.append('name', infoForm.name.trim());
      formData.append('phone', infoForm.phone.trim());
      if (infoForm.avatarFile) {
        formData.append('profilePicture', infoForm.avatarFile);
      }

      const res = await updateUserProfile(formData);
      if (res && res.success) {
        setInfoSuccess(res.msg || 'Profile details updated successfully!');
        
        // Refetch details to get updated state
        const updated = await getUserProfile();
        if (updated && updated.success) {
          const profile = updated.userProfile || {};
          setProfileData(profile);
          setInfoForm({
            name: profile.name || '',
            phone: profile.phone || '',
            avatarFile: null,
          });
          if (profile.avatarUrl) {
            setAvatarPreview(profile.avatarUrl);
          }
          // Update global auth context
          updateUserFields({
            name: profile.name,
            avatarUrl: profile.avatarUrl,
          });
        }
      }
    } catch (err) {
      console.error(err);
      setInfoError(err.message || 'Failed to update profile.');
    } finally {
      setInfoSubmitting(false);
    }
  };

  // Handle password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordSubmitting(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      const res = await changeUserPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res && res.success) {
        setPasswordSuccess(res.msg || 'Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error(err);
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // Render initial letters for avatar preview replacement
  const userInitials = profileData?.name
    ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="profile-page-container">
      {/* Navbar header */}
      <nav className="navbar">
        <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          ApexMarket
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ⬅ Back to Dashboard
        </button>
      </nav>

      <main className="profile-content-area">
        {loading ? (
          <div className="profile-center-spinner">
            <div className="spinner"></div>
            <p>Loading your profile...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <span>⚠️</span> {error}
          </div>
        ) : (
          <div className="profile-grid">
            {/* Left Sidebar: User Card */}
            <div className="profile-user-card glass-panel">
              <div className="profile-card-avatar-wrapper">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="User Avatar" className="profile-card-avatar" />
                ) : (
                  <div className="profile-card-avatar-fallback">{userInitials}</div>
                )}
              </div>
              <h2 className="profile-card-name">{profileData.name}</h2>
              <p className="profile-card-email">{profileData.email}</p>
              <div className="profile-card-badge-container">
                <span className={`role-badge ${user?.role === 'vendor' ? 'vendor' : 'customer'}`}>
                  {user?.role || 'customer'}
                </span>
              </div>
              {profileData.phone && (
                <div className="profile-card-phone-section">
                  <span className="phone-icon">📞</span>
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>

            {/* Right: Settings Forms */}
            <div className="profile-settings-forms">
              {/* Form 1: Edit Profile details */}
              <div className="profile-settings-section glass-panel">
                <h3 className="section-title">Profile Information</h3>
                <p className="section-subtitle">Update your public profile details and avatar.</p>

                <form onSubmit={handleInfoSubmit} className="settings-form">
                  {infoSuccess && (
                    <div className="alert alert-success">
                      <span>✓</span> {infoSuccess}
                    </div>
                  )}
                  {infoError && (
                    <div className="alert alert-error">
                      <span>⚠️</span> {infoError}
                    </div>
                  )}

                  <div className="form-group avatar-upload-group">
                    <label className="form-label">Avatar Picture</label>
                    <div className="avatar-upload-row">
                      <div className="avatar-upload-preview">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Preview" />
                        ) : (
                          <div className="avatar-upload-fallback">{userInitials}</div>
                        )}
                      </div>
                      <div className="avatar-upload-input-container">
                        <label htmlFor="avatar-file-input" className="btn btn-secondary upload-btn">
                          📷 Choose Avatar
                        </label>
                        <input
                          id="avatar-file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          style={{ display: 'none' }}
                        />
                        <span className="file-info-text">Supports PNG, JPG, or WebP. Max 5MB.</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-name">
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      className="form-input"
                      placeholder="Enter your name"
                      value={infoForm.name}
                      onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-phone">
                      Phone Number
                    </label>
                    <input
                      id="profile-phone"
                      type="tel"
                      className="form-input"
                      placeholder="Enter phone number"
                      value={infoForm.phone}
                      onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={infoSubmitting}>
                    {infoSubmitting ? <span className="spinner"></span> : 'Save Details'}
                  </button>
                </form>
              </div>

              {/* Form 2: Change Password */}
              <div className="profile-settings-section glass-panel">
                <h3 className="section-title">Change Password</h3>
                <p className="section-subtitle">Ensure your account is secure with a custom password.</p>

                <form onSubmit={handlePasswordSubmit} className="settings-form">
                  {passwordSuccess && (
                    <div className="alert alert-success">
                      <span>✓</span> {passwordSuccess}
                    </div>
                  )}
                  {passwordError && (
                    <div className="alert alert-error">
                      <span>⚠️</span> {passwordError}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="current-password">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="form-input"
                      placeholder="Enter current password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="new-password">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="form-input"
                      placeholder="Minimum 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="confirm-password">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="form-input"
                      placeholder="Repeat new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={passwordSubmitting}>
                    {passwordSubmitting ? <span className="spinner"></span> : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
