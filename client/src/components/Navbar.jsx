import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          TaskManager
        </div>

        {user && (
          <div className="nav-actions">
            <div className="nav-user">
              <div className="user-avatar">
                {getInitials(user.name)}
              </div>
              <span 
                className="user-name" 
                onClick={() => setIsProfileOpen(true)}
                title="Edit Profile"
              >
                {user.name}
              </span>
            </div>
            <button className="btn-logout" onClick={logout}>
              Log Out
            </button>
          </div>
        )}
      </nav>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export default Navbar;
