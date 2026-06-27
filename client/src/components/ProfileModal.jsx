import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setLocalError('Name cannot be empty');
      return;
    }

    setLocalError('');
    setLocalSuccess('');
    setIsSubmitting(true);

    try {
      await updateProfile(name);
      setLocalSuccess('Profile updated successfully!');
      setTimeout(() => {
        setLocalSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setLocalError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Edit Profile</h4>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {localError && <div className="alert alert-danger">{localError}</div>}
        {localSuccess && <div className="alert alert-success">{localSuccess}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input
              type="text"
              id="profile-name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn"
              disabled={isSubmitting || name.trim() === user?.name}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
